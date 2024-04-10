import convertHTMLandCSSToImage from '../utils/convertHTMLandCSSToImage.js';

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

            function cleanUrlText(text) {
                // Map for replacing Arabic characters with English equivalents
                const arabicToEnglishMap = {
                    'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a',
                    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
                    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
                    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
                    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
                    'ع': 'e', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
                    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
                    'ه': 'h', 'ة': 'h', 'و': 'o', 'ؤ': 'o',
                    'ي': 'y', 'ئ': 'y', 'ى': 'a'
                };

                // Regular expression to remove diacritics (Tashkeel) from Arabic text
                const arabicDiacriticsRegex = /[\u064B-\u065F\u0670\u0610-\u061A]/g;
                // Remove diacritics from the text
                text = text.replace(arabicDiacriticsRegex, '');

                // Convert the text to lowercase for consistency
                text = text.toLowerCase();

                // Replace Arabic characters with their English equivalents
                text = text.replace(/[^\u0000-\u007E]/g, function (char) {
                    return arabicToEnglishMap[char] || ''; // Use the corresponding English character if exists, otherwise empty string
                });

                // Replace spaces with underscores
                text = text.replace(/\s+/g, '_');

                // Remove any characters not allowed in URL paths
                text = text.replace(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/g, '');

                // Remove parentheses and other unwanted symbols
                text = text.replace(/[(){}<>\[\]]+/g, '');

                return text;
            }


        }
    });
}