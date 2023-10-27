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
        const adhkarPath = path.join(__dirname, 'public/json/adhkar.json');
        const adhkarJson = await fs.readJson(adhkarPath).catch(() => ({}));
        const adhkarKey = Object.keys(adhkarJson);
        const quranPath = path.join(__dirname, 'public/json/quran.json');
        const quranJson = await fs.readJson(quranPath).catch(() => ({}));
        const hisnmuslimPath = path.join(__dirname, 'public/json/hisnmuslim.json');
        const hisnmuslimJson = await fs.readJson(hisnmuslimPath).catch(() => ({}));
        const radioPath = path.join(__dirname, 'public/json/radio.json');
        const radioJson = await fs.readJson(radioPath).catch(() => ({}));


        const Pages = [
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

        // الأذكار
        for (let item of adhkarKey) {

            const adhkarJsonitem = adhkarJson?.[item];

            Pages.push({
                url: `${WEBSITE_DOMAIN}/adhkar/${adhkarJsonitem?.category.replace(/ /g, '_')}`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            })

            for (let iterator of adhkarJsonitem?.array) {
                Pages.push({
                    url: `${WEBSITE_DOMAIN}/adhkars/${iterator?.title?.replace(/ /g, '_')}`,
                    lastmod: formattedNowDate,
                    changefreq: "monthly",
                    priority: 0.8,
                })
            }
        }

        // القرآن الكريم
        for (let item of quranJson) {
            Pages.push({
                url: `${WEBSITE_DOMAIN}/quran/${item?.name?.replace(/ /g, '_')}`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            })
        }

        // الإذاعات الإسلامية
        for (let item of radioJson) {
            Pages.push({
                url: `${WEBSITE_DOMAIN}/radios/${item?.id}`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            })
        }

        // حصن المسلم
        for (let item of hisnmuslimJson) {

            Pages.push({
                url: `${WEBSITE_DOMAIN}/hisnmuslim/${item?.category?.replace(/ /g, '_')}`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            })

            for (let iterator of item?.array) {

                const title = removeArabicDiacritics(iterator?.text, 15);
                Pages.push({
                    url: `${WEBSITE_DOMAIN}/hisnmuslims/${title?.replace(/ /g, '_')}`,
                    lastmod: formattedNowDate,
                    changefreq: "monthly",
                    priority: 0.8,
                })
            }
        }

        // Users
        for (let item of getUsers) {

            Pages.push({
                url: `${WEBSITE_DOMAIN}/username/${item?.username}`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            })
        }

        // قئات المجتمع
        for (let item of getCategories) {

            Pages.push({
                url: `${WEBSITE_DOMAIN}/forum/${item?.category_id}`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            })
        }

        // مواضيع المجتمع
        for (let item of getTopics) {

            Pages.push({
                url: `${WEBSITE_DOMAIN}/topis/${item?.topic_id}`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            })
        }

        // تعليقات المجتمع
        for (let item of getComments) {

            Pages.push({
                url: `${WEBSITE_DOMAIN}/comments/${item?.comment_id}`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            })
        }

        // قم بإنشاء مصفوفة فارغة لتخزين الكلمات المفردة
        const uniqueWords = [];

        // قم بدورة على جميع السجلات المسترجعة من القاعدة
        getTags.forEach((tag) => {
            // قم بفحص كل عنصر في مصفوفة tag_name
            tag.tag_name.forEach((word) => {
                // إذا لم تكن الكلمة موجودة بالفعل في المصفوفة النهائية، قم بإضافتها
                if (!uniqueWords.includes(word)) {
                    uniqueWords.push(word);
                }
            });
        });

        // هاشتاقات المجتمع
        for (let item of uniqueWords) {

            Pages.push({
                url: `${WEBSITE_DOMAIN}/tags/${item}`,
                lastmod: formattedNowDate,
                changefreq: "daily",
                priority: 0.8,
            })
        }

        const result = await generateSitemap(Pages);

        response.json(result);
    });

    function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // يجب زيادة الشهر بواحد لأن الأشهر تبدأ من 0.
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function removeArabicDiacritics(sentence, itemWords) {
        const diacriticsMap = {
            'آ': 'ا',
            'أ': 'ا',
            'إ': 'ا',
            'اً': 'ا',
            'ٱ': 'ا',
            'ٲ': 'ا',
            'ٳ': 'ا',
            'ٵ': 'ا',
            'ٷ': 'ؤ',
            'ٹ': 'ت',
            // Add more Arabic characters and their replacements as needed
        };
        return sentence?.replace(/[\u064B-\u065F\u0670]/g, '')
            .split(" ")?.slice(0, parseInt(itemWords))?.join(' ')
            .replace(/\)/g, "")
            .replace(/\(/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "")
            .replace(/\﴿/g, "")
            .replace(/\﴾/g, "")
            .replace(/\ /g, "_")
            .replace(/\,/g, "")
            .replace(/\،/g, "")
            .replace(/\:/g, "")
            .replace(/\./g, "")
            .replace(/./g, char => diacriticsMap[char] || char);
    }
}