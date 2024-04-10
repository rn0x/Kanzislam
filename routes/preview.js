import checkFileExists from '../utils/checkIfFilesExists.js';
import cleanUrlText from '../utils/cleanUrlText.js';
import convertHTMLandCSSToImage from '../utils/convertHTMLandCSSToImage.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, analyzeText }) => {

    app.get('/preview', async (request, response) => {
        const title = request.query?.title;
        const description = request.query?.description;
        const username = request.query?.username;
        const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

        if (title && description) {
            const analyzeDescription = await analyzeText(description, config);
            const keywords = analyzeDescription?.words?.value;
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `${title} - ${config.WEBSITE_NAME}`,
                keywords: keywords,
                description: description,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
                query: {
                    title,
                    description,
                    keywords,
                    username
                },
                formattedDate
            };
            const pugPath = path.join(__dirname, './views/preview.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        } else {
            response.redirect('/not-found');
        }
    });

    app.get('/puppeteer', async (request, response) => {
        const title = request.query?.title;
        const description = request.query?.description;
        const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

        if (title && description) {
            const previewPath = path.join(__dirname, 'public', 'preview');
            fs.ensureDirSync(previewPath); // يتأكد من وجود المجلد أو يقوم بإنشائه إذا لم يكن موجودًا

            const cleanedTitle = cleanUrlText(title);
            const imagePath = path.join(previewPath, `${cleanedTitle}.jpeg`);

            if (checkFileExists(imagePath)) {
                // Image exists, serve it directly
                response.sendFile(imagePath);
            } else {
                // Image does not exist, create it
                const puppeteerConfig = {
                    headless: "new",
                    args: [
                        '--disable-dev-shm-usage',
                        '--start-maximized',
                        '--allow-insecure-localhost',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu',
                    ],
                    executablePath: config?.CHROMIUM_PATH ? config?.CHROMIUM_PATH : undefined
                };

                const result = await convertHTMLandCSSToImage({
                    outputPath: imagePath,
                    width: 1200,
                    height: 630,
                    retryLimit: 3,
                    format: 'jpeg',
                    cspHeader: "default-src 'self'; img-src data:;",
                    puppeteerConfig: puppeteerConfig,
                    url: `${config.WEBSITE_DOMAIN}/preview?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
                });

                if (result.success) {
                    response.setHeader('Content-Type', 'image/jpeg');
                    response.sendFile(imagePath);
                } else {
                    response.status(500).send(`Error: ${result.message}`);
                }
            }

            


        }
    });
}