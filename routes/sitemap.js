import generateSitemap from '../modules/generateSitemap.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model }) => {

    app.get('/sitemap.xml', async (request, response) => {

        const WEBSITE_DOMAIN = config?.WEBSITE_DOMAIN;
        const nowDate = new Date();
        const formattedNowDate = formatDateToYYYYMMDD(nowDate);
        const {
            Users,
            Categories,
            Topics,
            Comments,
            Tags,
            Images,
            Videos,
            Audios,
        } = model;
        const getUsers = await Users.findAll().catch((error) => {
            console.log(error);
        });
        const getCategories = await Categories.findAll().catch((error) => {
            console.log(error);
        });
        const getTopics = await Topics.findAll().catch((error) => {
            console.log(error);
        });
        const getComments = await Comments.findAll().catch((error) => {
            console.log(error);
        });
        const getTags = await Tags.findAll().catch((error) => {
            console.log(error);
        });


        const BasicPages = [
            {
                url: WEBSITE_DOMAIN,
                lastmod: formattedNowDate,
                changefreq: 'weekly',
                priority: 1,
               // images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            },
            {
                url: `${WEBSITE_DOMAIN}/quran`,
                lastmod: formattedNowDate,
                changefreq: 'monthly',
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/adhkar`,
                lastmod: formattedNowDate,
                changefreq: 'monthly',
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/hisnmuslim`,
                lastmod: formattedNowDate,
                changefreq: 'monthly',
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/prayer`,
                lastmod: formattedNowDate,
                changefreq: 'daily',
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/forum`,
                lastmod: formattedNowDate,
                changefreq: 'daily',
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/videos`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/images`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/audios`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/albitaqat`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/radio`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/allah`,
                lastmod: formattedNowDate,
                changefreq: "never",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/sabha`,
                lastmod: formattedNowDate,
                changefreq: "never",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/historical-events`,
                lastmod: formattedNowDate,
                changefreq: "yearly",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/fataawa-ibn-baaz`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            },
            {
                url: `${WEBSITE_DOMAIN}/tafsir-quran`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            },
            // يمكن إضافة المزيد من الصفحات هنا...
        ];

        const result = await generateSitemap(BasicPages);
        console.log(BasicPages);

        response.send(result);
    });

    function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // يجب زيادة الشهر بواحد لأن الأشهر تبدأ من 0.
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}