import convertHTMLandCSSToImage from '../modules/convertHTMLandCSSToImage.js';

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
            const options = {};
            options.website_name = config.WEBSITE_NAME;
            options.title = `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`;
            options.keywords = ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"];
            options.description = "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.";
            options.preview = "صورة_المعاينة_للصفحة";
            options.status = 404;
            options.session = request.session;
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
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
            const imagePath = path.join(__dirname, `public/preview/${title?.replace(/ /g, '_')}.png`);

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
                    width: 1920,
                    height: 1080,
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
        }
    });
}