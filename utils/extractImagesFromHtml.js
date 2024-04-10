import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

/**
 * تحقق مما إذا كان رابط الصورة يشير إلى نوع ملف صورة.
 * @param {string} url - رابط الصورة.
 * @returns {Promise<boolean>} - يتم حل الوعد بقيمة boolean تشير إلى ما إذا كان الرابط يشير إلى صورة أم لا.
 */
async function isImage(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');

        return contentType && contentType.startsWith('image');
    } catch (error) {
        console.error("Error checking image type:", error.message);
        return false;
    }
}

/**
 * استخراج روابط الصور من كود HTML.
 * @param {string} html - كود HTML.
 * @returns {Promise<string[]>} - يتم حل الوعد بمصفوفة تحتوي على روابط الصور.
 */
export default async function extractImagesFromHtml(html) {
    try {
        const imageArray = [];

        // استخدام jsdom لتحليل الوثيقة الفائقة
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // اختيار جميع العناصر التي تحتوي على صورة (img) أو روابط الصور (link) أو روابط تحتوي على صور (a)
        const allElements = doc.querySelectorAll('*');

        // استخدام Promise.all مع map
        const imagePromises = Array.from(allElements).map(async (element) => {
            const imageUrl = element.getAttribute('src') || element.getAttribute('href');

            if (imageUrl && (await isImage(imageUrl))) {
                // إضافة الرابط إلى المصفوفة إذا كانت الروابط تشير إلى صورة
                return imageUrl;
            }
        });

        // استخدام Promise.all لحل الوعود والتأكد من استكمال جميع العمليات بنجاح
        const images = await Promise.all(imagePromises);

        // تصفية النتائج للتخلص من القيم الفارغة أو غير المعرفة
        const filteredImages = images.filter((imageUrl) => imageUrl);

        // إرجاع المصفوفة
        return filteredImages;
    } catch (error) {
        console.error("Error extracting images from HTML:", error.message);
        throw error;
    }
}