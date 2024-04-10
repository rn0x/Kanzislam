import fetch from 'node-fetch';
import path from 'path';
import sitemap from './sitemap.js';
import cleanUrlText from './cleanUrlText.js';
import checkFileExists from './checkIfFilesExists.js';

async function fetchOgImage(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // استخراج القيمة لخاصية og:image باستخدام Regex
        const ogImageRegex = /<meta\s+property="og:image"\s+content="([^"]+)"/;
        const match = html.match(ogImageRegex);

        if (!match || !match[1]) {
            throw new Error('لم يتم العثور على خاصية og:image في الصفحة.');
        }

        return match[1]; // عنوان الصورة المحدد بواسطة خاصية og:image
    } catch (error) {
        throw new Error(`حدث خطأ أثناء جلب الصورة: ${error.message}`);
    }
}

async function main(url) {
    try {

        const __dirname = path.resolve();
        const ogImageUrl = await fetchOgImage(url);
        const decodedUrl = decodeURIComponent(ogImageUrl);
        const urlString = decodedUrl?.replace(/&amp;/g, '&');
        const parsedUrl = new URL(urlString);
        const queryParams = parsedUrl.searchParams;
        const title = queryParams.get('title');
        const cleanedTitle = cleanUrlText(title);
        const previewPath = path.join(__dirname, 'public', 'preview');
        const imagePath = path.join(previewPath, `${cleanedTitle}.jpeg`);
        const checkExists = checkFileExists(imagePath);

        if (checkExists) {
            return
        }

        const response = await fetch(urlString);

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            return
        }

        await response.buffer();

        console.log("request: true");
    } catch (error) {
        console.error('حدث خطأ:', error.message);
        console.log(error.message);
    }
}

let num = 0
for (const iterator of await sitemap()) {
    await main(iterator.url);
    console.log(num++);
}
