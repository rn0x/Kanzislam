import fs from 'fs-extra';
import path from 'path';
import { modelObject } from '../database/index.js';

export default async function generateSitemap(newPages) {
  try {
    const __dirname = path.resolve();
    const sitemapSizeLimit = 50000;
    const configPath = path.join(__dirname, 'config.json');
    const config = await fs.readJson(configPath).catch(() => ({}));
    const sitemapDir = path.join(__dirname, 'public/sitemap');
    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    for (let item of newPages) {
      await modelObject.Sitemap.upsert(item);
    }

    const pages = await modelObject.Sitemap.findAll();
    const totalLinks = pages.length;
    const numSitemaps = Math.ceil(totalLinks / sitemapSizeLimit);

    let pageIndex = 0;
    let currentPage = 1;
    let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    sitemapContent += '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    for (const page of pages) {
      if (currentPage > sitemapSizeLimit) {
        const sitemapFileName = `sitemap-${pageIndex}.xml`;
        const sitemapPath = path.join(sitemapDir, sitemapFileName);
        fs.writeFileSync(sitemapPath, sitemapContent + '\n</urlset>', 'utf-8');
        sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        pageIndex++;
        currentPage = 1;
      }

      const { url, lastmod, changefreq, priority, images } = page;
      sitemapContent += '\n  <url>';
      sitemapContent += `\n    <loc>${url}</loc>`;
      if (lastmod) sitemapContent += `\n    <lastmod>${lastmod}</lastmod>`;
      sitemapContent += `\n    <changefreq>${changefreq || 'weekly'}</changefreq>`;
      sitemapContent += `\n    <priority>${priority || 0.5}</priority>`;
      if (images) {
        for (const image of images) {
          sitemapContent += 
`\n    <image:image>
      <image:loc>${image}</image:loc>
    </image:image>`;
        }
      }
      sitemapContent += '\n  </url>';

      currentPage++;
    }

    const sitemapFileName = `sitemap-${pageIndex}.xml`;
    const sitemapPath = path.join(sitemapDir, sitemapFileName);
    fs.writeFileSync(sitemapPath, sitemapContent + '\n</urlset>', 'utf-8');

    const sitemapIndexFileName = 'sitemap-index.xml';
    const sitemapIndexPath = path.join(sitemapDir, sitemapIndexFileName);
    const sitemapIndexFile = fs.createWriteStream(sitemapIndexPath);
    let sitemapIndexContent = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (let i = 0; i < numSitemaps; i++) {
      const sitemapFileName = `sitemap-${i}.xml`;
      sitemapIndexContent += `\n  <sitemap>`;
      sitemapIndexContent += `\n    <loc>${config?.WEBSITE_DOMAIN}/sitemap/${sitemapFileName}</loc>`;
      sitemapIndexContent += '\n  </sitemap>';
    }

    sitemapIndexContent += '\n</sitemapindex>';
    sitemapIndexFile.write(sitemapIndexContent, 'utf-8');
    sitemapIndexFile.end();

    // Calculate the number of sitemaps, number of links in each sitemap, and total links.
    const sitemapsAvailable = numSitemaps;
    const linksPerSitemap = sitemapSizeLimit;

    return {
      sitemapsAvailable: sitemapsAvailable,
      linksPerSitemap: linksPerSitemap,
      totalLinks: totalLinks,
      sitemapFilePath: "/sitemap/sitemap-index.xml", // مسار الملف الرئيسي للخريطة
    };
  } catch (error) {
    console.error('حدث خطأ أثناء تنفيذ الدالة:', error);
  }
}
