import puppeteer from 'puppeteer-core';
import DOMPurify from 'dompurify';

/**
 * تحويل الصفحة HTML و CSS إلى صورة باستخدام Puppeteer.
 *
 * @param {Object} options - الخيارات لعملية التحويل.
 * @param {string} options.htmlCode - كود HTML الصفحة المراد تحويلها إلى صورة.
 * @param {string} options.cssCode - كود CSS لتنسيق الصفحة.
 * @param {string} options.outputPath - المسار الذي سيتم حفظ الصورة فيه.
 * @param {string} options.url - رابط الصفحة المراد التقاط صورة لها
 * @param {number} [options.width=1200] - عرض الصفحة (بكسل).
 * @param {number} [options.height=800] - ارتفاع الصفحة (بكسل).
 * @param {string} [options.format='png'] - تنسيق الصورة ('png', 'jpg', 'jpeg', 'webp').
 * @param {number} [options.retryLimit=3] - عدد مرات المحاولة في حالة فشل التحويل.
 * @param {string} [options.cspHeader="default-src 'self';"] - إعداد أمان المصادر المحتوى (CSP).
 * @param {Object} [options.puppeteerConfig] - إعدادات محرك Puppeteer.
 * @param {boolean} [options.puppeteerConfig.headless="new"] - تشغيل المتصفح بدون واجهة رسومية.
 * @param {string[]} [options.puppeteerConfig.args] - قائمة الخيارات لمحرك Puppeteer.
 *
 * @returns {Object} - كائن يحتوي على معلومات العملية.
 * @property {boolean} success - تمت عملية التحويل بنجاح أم لا.
 * @property {string} message - رسالة توضح نتيجة العملية.
 * @property {string} imagePath - المسار إلى الصورة المحفوظة (إذا تمت العملية بنجاح).
 * @property {string} buffer - المخزن المؤقت للصورة Buffer
 *
 */

export default async function convertHTMLandCSSToImage(options) {
    let browser, page;
    const result = {
        success: false,
        message: '',
        imagePath: '',
        buffer: null
    };

    try {
        browser = await puppeteer.launch(options?.puppeteerConfig)
            .catch(e => console.log('Error: browser is not launch ', e));
        page = await browser.newPage();

        for (let retryCount = 0; retryCount < options.retryLimit; retryCount++) {

            try {
                await page.setViewport({ width: options?.width, height: options?.height });

                if (options?.htmlCode && options?.cssCode) {
                    const sanitizedHTML = DOMPurify.sanitize(options?.htmlCode);
                    const sanitizedCSS = DOMPurify.sanitize(options?.cssCode);

                    const cspSettings = {
                        name: 'Content-Security-Policy',
                        value: options?.cspHeader,
                    };

                    await page.setExtraHTTPHeaders({ headers: [cspSettings] });

                    await page.setContent(sanitizedHTML, { style: sanitizedCSS });
                }

                await page.goto(options?.url, {
                    waitUntil: 'networkidle0',
                    timeout: 600000
                })

                //await page.waitForTimeout(5000);
                const screenshotOptions = {
                    path: options.outputPath,
                    fullPage: true,
                };

                if (options?.format === 'jpg' || options?.format === 'jpeg') {
                    screenshotOptions.type = 'jpeg';
                } else if (options?.format === 'webp') {
                    screenshotOptions.type = 'webp';
                }

                const screenshot = await page.screenshot(screenshotOptions);
                await page.setCacheEnabled(true);

                result.success = true;
                result.message = `تم تحويل الصفحة إلى صورة وحفظها في ${options?.outputPath}`;
                result.imagePath = options?.outputPath;
                result.buffer = screenshot;
                break; // Success, exit the loop
            } catch (error) {
                result.message = `حدث خطأ: ${error}`;
                console.error(result.message);
            }
        }
    } catch (error) {
        result.message = `Failed to launch Puppeteer: ${error}`;
        console.error(result.message);
    } finally {
        if (page) {
            await page.close();
        }
        if (browser) {
            await browser.close();
        }
    }

    if (!result.success) {
        result.message = `لم يتمكن من تحويل الصفحة بنجاح بعد ${options.retryLimit} محاولات.`;
        console.error(result.message);
    }

    return result;
}



/*
// استخدام الدالة مع الإعدادات المخصصة و CSP

const puppeteerConfig = {
    headless: true, // تشغيل متصفح بدون واجهة رسومية
    args: [
        '--no-sandbox', // تجنب مشكلات التشغيل على Linux
        '--disable-setuid-sandbox', // تجنب مشكلات التشغيل على Linux
        '--disable-dev-shm-usage', // تجنب مشكلات الذاكرة المشتركة على Linux
        '--disable-accelerated-2d-canvas', // تجنب مشكلات الرسومات على Linux
        '--disable-gpu', // تجنب استخدام وحدة المعالجة الرسومية
    ],
};

convertHTMLandCSSToImage({
    htmlCode: '<div>Hello, World!</div>',
    cssCode: 'div { color: red; }',
    outputPath: 'output.png',
    width: 1920,
    height: 1080,
    quality: 90,
    format: 'png',
    cspHeader: "default-src 'self'; img-src data:;",
    puppeteerConfig: puppeteerConfig,
    url: "link"
});
*/