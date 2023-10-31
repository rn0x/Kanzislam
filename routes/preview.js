import convertHTMLandCSSToImage from '../modules/convertHTMLandCSSToImage.js';
import error from './error.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, analyzeText }) => {
    // Middleware function to check if an image exists
    const checkIfImageExists = (imagePath) => {
        try {
            fs.accessSync(imagePath);
            return true;
        } catch (error) {
            return false;
        }
    };

    app.get('/preview', async (request, response) => {
        const title = request.query?.title;
        const description = request.query?.description;
        const username = request.query?.username;
        const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

        if (title && description) {
            const analyzeDescription = analyzeText(description);
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
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }
    });

    app.get('/puppeteer', async (request, response) => {
        const title = request.query?.title;
        const description = request.query?.description;
        const username = request.query?.username;
        const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

        if (title && description) {
            const previewPath = path.join(__dirname, 'public', 'preview');
            fs.ensureDirSync(previewPath);
            const imagePath = path.join(__dirname, `public/preview/${removeArabicSymbols(title)}.png`);
            if (checkIfImageExists(imagePath)) {
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
                    executablePath: config?.CHROMIUM_PATH ? config?.CHROMIUM_PATH : undefined // مسار متصفح Chromium او Chrome
                };

                const result = await convertHTMLandCSSToImage({
                    outputPath: imagePath,
                    width: 1200,
                    height: 630,
                    retryLimit: 3,
                    format: 'png',
                    cspHeader: "default-src 'self'; img-src data:;",
                    puppeteerConfig: puppeteerConfig,
                    url: `${config.WEBSITE_DOMAIN}/preview?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
                });

                if (result.success) {
                    response.setHeader('Content-Type', 'image/png');
                    response.sendFile(imagePath);
                } else {
                    response.status(500).send(`Error: ${result.message}`);
                }
            }

            function removeArabicSymbols(text) {
                // إزالة الرموز غير القابلة للعرض
                text = text?.replace(/[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\u0750-\u077F]+/g, '');

                // تحويل المسافات إلى شرطة سفلية
                text = text?.replace(/\s/g, '_');

                return text;
            }
        }
    });
}