import fs from 'fs-extra';
import path from 'path';
import { modelObject } from '../database/index.js';

/**
 * يقوم بإنشاء ملفات خريطة الموقع استنادًا إلى الصفحات المقدمة والتكوين.
 * @param {Array} newPages - مصفوفة من الصفحات الجديدة التي يجب إضافتها إلى خريطة الموقع.
 * @returns {Promise<Object>} - معلومات حول خرائط الموقع التي تم إنشاؤها.
 */
export default async function generateSitemap(newPages) {
  try {
    const __dirname = path.resolve();
    const configPath = path.join(__dirname, 'config.json');
    const config = await fs.readJson(configPath).catch(() => ({}));
    const sitemapDir = path.join(__dirname, 'public/sitemap');
    const sitemapSizeLimit = config?.SITEMAP_LIMIT;

    // التأكد من وجود دليل خريطة الموقع
    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    // دفع صفحات جديدة إلى قاعدة البيانات
    await modelObject.Sitemap.bulkCreate(newPages, { updateOnDuplicate: ['url'] });

    // استرجاع جميع الصفحات من قاعدة البيانات
    const pages = await modelObject.Sitemap.findAll();
    const totalLinks = pages.length;
    const numSitemaps = Math.ceil(totalLinks / sitemapSizeLimit);

    let pageIndex = 0;
    let currentPage = 1;
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // إنشاء محتوى خريطة الموقع
    for (const page of pages) {
      if (currentPage > sitemapSizeLimit) {
        const sitemapFileName = `sitemap-${pageIndex}.xml`;
        const sitemapPath = path.join(sitemapDir, sitemapFileName);
        await fs.promises.writeFile(sitemapPath, sitemapContent + '\n</urlset>', 'utf-8');
        sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
        pageIndex++;
        currentPage = 1;
      }

      const { url, lastmod, changefreq, priority, images } = page;
      sitemapContent += `\n  <url>`;
      sitemapContent += `\n    <loc>${url}</loc>`;
      if (lastmod) sitemapContent += `\n    <lastmod>${lastmod}</lastmod>`;
      sitemapContent += `\n    <changefreq>${changefreq || 'weekly'}</changefreq>`;
      sitemapContent += `\n    <priority>${priority || 0.5}</priority>`;

      if (images) {
        for (const image of images) {
          sitemapContent += `\n    <image:image>`;
          sitemapContent += `\n      <image:loc>${image}</image:loc>`;
          sitemapContent += `\n    </image:image>`;
        }
      }

      sitemapContent += '\n  </url>';
      currentPage++;
    }

    const sitemapFileName = `sitemap-${pageIndex}.xml`;
    const sitemapPath = path.join(sitemapDir, sitemapFileName);
    await fs.promises.writeFile(sitemapPath, sitemapContent + '\n</urlset>', 'utf-8');

    // إنشاء فهرس خريطة الموقع
    const sitemapIndexFileName = 'sitemap-index.xml';
    const sitemapIndexPath = path.join(sitemapDir, sitemapIndexFileName);
    const sitemapIndexContent = generateSitemapIndexContent(numSitemaps, config?.WEBSITE_DOMAIN);
    await fs.promises.writeFile(sitemapIndexPath, sitemapIndexContent, 'utf-8');

    // حساب وإرجاع معلومات خريطة الموقع
    const sitemapsAvailable = numSitemaps;
    const linksPerSitemap = sitemapSizeLimit;

    return {
      sitemapsAvailable: sitemapsAvailable,
      linksPerSitemap: linksPerSitemap,
      totalLinks: totalLinks,
      sitemapFilePath: "/sitemap/sitemap-index.xml",
    };
  } catch (error) {
    console.error('حدث خطأ أثناء تنفيذ الدالة:', error);
  }
}

/**
 * يقوم بإنشاء محتوى فهرس خريطة الموقع.
 * @param {number} numSitemaps - عدد خرائط الموقع.
 * @param {string} websiteDomain - نطاق الموقع.
 * @returns {string} - محتوى فهرس خريطة الموقع.
 */
function generateSitemapIndexContent(numSitemaps, websiteDomain) {
  let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (let i = 0; i < numSitemaps; i++) {
    const sitemapFileName = `sitemap-${i}.xml`;
    sitemapIndexContent += `\n  <sitemap>`;
    sitemapIndexContent += `\n    <loc>${websiteDomain}/sitemap/${sitemapFileName}</loc>`;
    sitemapIndexContent += '\n  </sitemap>';
  }

  sitemapIndexContent += '\n</sitemapindex>';
  return sitemapIndexContent;
}