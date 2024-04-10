import fetch from 'node-fetch';
import sitemap from './sitemap.js';

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

        const ogImageUrl = await fetchOgImage(url);
        const decodedUrl = decodeURIComponent(ogImageUrl);
        const link = decodedUrl.replace(/&amp;/g, '&');
        const response = await fetch(link);

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            return
        }

        await response.buffer();
        console.log(link);
        console.log("___________________________");
        console.log(url);
    } catch (error) {
        console.error('حدث خطأ:', error.message);
    }
}

let num = 0
for (const iterator of await sitemap()) {
    await main(iterator.url);
    console.log(num++);
}
