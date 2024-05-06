import sitemapUtlis from './sitemapUtlis.js';
import {
    getAllCategories,
    getFatwasForCategory,
} from './fatawaUtils.js';
import fs from 'fs-extra';
import path from 'path';
import "dotenv/config";

async function generateSitemap() {

    const __dirname = path.resolve();
    const WEBSITE_DOMAIN = process.env.WEBSITE_DOMAIN;
    const nowDate = new Date();
    const formattedNowDate = formatDateToYYYYMMDD(nowDate);
    const adhkarPath = path.join(__dirname, 'src/data/json/adhkar.json');
    const adhkarJson = await fs.readJson(adhkarPath).catch(() => ({}));
    const adhkarKey = Object.keys(adhkarJson);
    const quranPath = path.join(__dirname, 'src/data/json/quran_info.json');
    const quranJson = await fs.readJson(quranPath).catch(() => ({}));
    const hisnmuslimPath = path.join(__dirname, 'src/data/json/hisnmuslim.json');
    const hisnmuslimJson = await fs.readJson(hisnmuslimPath).catch(() => ({}));
    const radioPath = path.join(__dirname, 'src/data/json/radio.json');
    const radioJson = await fs.readJson(radioPath).catch(() => ({}));
    const tafsir_name_path = path.join(__dirname, 'src/data/json/tafsir/tafsir_name.json');
    const tafsir_name_json = await fs.readJson(tafsir_name_path).catch(() => ({}));
    const ayatPath = path.join(__dirname, 'src/data/json/ayat.json');
    const ayatJson = await fs.readJson(ayatPath).catch(() => ({}));
    const historyPath = path.join(__dirname, 'src/data/json/history.json');
    const historyJson = await fs.readJson(historyPath).catch(() => ({}));
    const fatwasPath = path.join(__dirname, 'src/data/json/fatwas.json');
    const fatwas = await fs.readJson(fatwasPath).catch(() => ({}));
    const AllCategories = getAllCategories(fatwas);

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

    // التفاسير 8

    for (let item of tafsir_name_json) {

        const tfsName = item?.name_english;

        for (let iterator of quranJson) {

            const surahId = iterator?.number;

            for (let lop of ayatJson[surahId - 1]?.ayat) {

                const ayahID = lop?.id;

                Pages.push({
                    url: `${WEBSITE_DOMAIN}/tafsir-quran/${tfsName}/${surahId}/${ayahID}`,
                    lastmod: formattedNowDate,
                    changefreq: "monthly",
                    priority: 0.8,
                })

            }

        }
    }

    // الأحداث التاريخية
    for (let item of historyJson) {

        Pages.push({
            url: `${WEBSITE_DOMAIN}/historical-events/${item?.id}`,
            lastmod: formattedNowDate,
            changefreq: "monthly",
            priority: 0.8,
        });
    }


    // الفتاوى 

    for (let item of AllCategories) {

        Pages.push({
            url: `${WEBSITE_DOMAIN}/fataawa-ibn-baaz/${item.replace(/ /g, '_')}`,
            lastmod: formattedNowDate,
            changefreq: "monthly",
            priority: 0.8,
        });

        const FatwasForCategory = getFatwasForCategory(fatwas, item);
        for (const iterator of FatwasForCategory) {
            Pages.push({
                url: `${WEBSITE_DOMAIN}/fataawa-ibn-baaz/${item.replace(/ /g, '_')}/${iterator.id}`,
                lastmod: formattedNowDate,
                changefreq: "monthly",
                priority: 0.8,
            });
        }

    }


    const result = await sitemapUtlis(Pages);
    console.log(result);

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

    return Pages
}


await generateSitemap();