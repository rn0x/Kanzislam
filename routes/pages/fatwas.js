import Fuse from 'fuse.js';
import { removeStopWords, removeArabicDiacritics } from '../../utils/textUtils.js';
import {
    getAllCategories,
    getCategorysWithCounts,
    getFatwasForCategory,
    getFatwaById
} from '../../utils/fatawaUtils.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, analyzeText, filterSpan }) => {

    const fatwasPath = path.join(__dirname, 'public/json/fatwas.json');
    const fatwas = await fs.readJson(fatwasPath).catch(() => ({}));

    app.get('/fataawa-ibn-baaz', async (request, response) => {
        try {
            const options = {
                website_name: config.WEBSITE_NAME,
                CONTACT: config.CONTACT,
                title: `موسوعة الفتاوى الإسلامية للشيخ إبن باز - ${config.WEBSITE_NAME}`,
                keywords: [
                    "فتاوى إسلامية",
                    "موسوعة دينية",
                    "الفتاوى الشرعية",
                    "فقه إسلامي",
                    "استشارات دينية",
                    "فتاوى المسلمين",
                    "مواضيع دينية",
                    "الفتاوى الدينية",
                    "فتاوى ابن باز",
                    "ابن باز",
                    "فتاوى صوتية",
                    "فتوى صوتية",
                    "فتوى api",
                    "فتاوي mp3",
                ],
                description: "موسوعة شاملة للفتاوى الإسلامية للشيخ ابن باز رحمه الله, تغطي جميع المواضيع الدينية والقضايا الشرعية بدقة وموضوعية، تقدم إجابات دقيقة وموثوقة لاستفساراتك الدينية.",
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("موسوعة الفتاوى الإسلامية للشيخ إبن باز")}&description=${encodeURIComponent("موسوعة شاملة للفتاوى الإسلامية للشيخ ابن باز رحمه الله, تغطي جميع المواضيع الدينية والقضايا الشرعية بدقة وموضوعية، تقدم إجابات دقيقة وموثوقة لاستفساراتك الدينية.")}`,
            };
            const pugPath = path.join(__dirname, './views/pages/fatwas.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

    app.get('/fataawa-ibn-baaz/:category', async (request, response) => {
        try {

            const category = request.params.category.replace(/_/g, ' ');
            const fatwasArray = getFatwasForCategory(fatwas, category);
            if (fatwasArray.length === 0) {
                response.redirect('/not-found');
            } else {
                const options = {
                    website_name: config.WEBSITE_NAME,
                    CONTACT: config.CONTACT,
                    title: `موسوعة الفتاوى المتعلقة ب${category} - ${config.WEBSITE_NAME}`,
                    keywords: [
                        `فتاوى ${category}`,
                        `حكم ${category} في الإسلام`,
                        `${category} والفقه الإسلامي`,
                        "فتاوى إسلامية",
                        "موسوعة دينية",
                        "الفتاوى الشرعية",
                        "فقه إسلامي",
                        "استشارات دينية",
                        "فتاوى المسلمين",
                        "مواضيع دينية",
                        "الفتاوى الدينية",
                        "فتاوى ابن باز",
                        "ابن باز",
                        "فتاوى صوتية",
                        "فتوى صوتية",
                        "فتوى api",
                        "فتاوي mp3",
                    ],
                    description: `تعرض هذه الصفحة الفتاوى المتعلقة بحكم ${category} في الإسلام للشيخ الامام ابن باز رحمه الله, فتاوى صوتية, فتاوى نصية, فتتاوى مكتوبة.`,
                    preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`موسوعة الفتاوى المتعلقة ب${category}`)}&description=${encodeURIComponent(`تعرض هذه الصفحة الفتاوى المتعلقة بحكم ${category} في الإسلام للشيخ الامام ابن باز رحمه الله, فتاوى صوتية, فتاوى نصية, فتتاوى مكتوبة.`)}`,
                    category: category,
                    fatwasArray: fatwasArray
                }; 
                const pugPath = path.join(__dirname, './views/pages/fatwas_category.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            } 
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

    app.get('/fataawa-ibn-baaz/:category/:id', async (request, response) => {
        try {
  
            const category = request.params.category.replace(/_/g, ' ');
            const id = request.params.id;
            const fatwasArray = getFatwasForCategory(fatwas, category);
            const FatwaById = getFatwaById(fatwas, id);
            if (fatwasArray.length === 0 && FatwaById) {
                response.redirect('/not-found');
            } else {
                const analyze = analyzeText(FatwaById.question); 
                const keywords = analyze?.words;
                const options = {
                    website_name: config.WEBSITE_NAME,
                    CONTACT: config.CONTACT,
                    title: `فتوى ${FatwaById.title} للشيخ ابن باز - ${config.WEBSITE_NAME}`,
                    keywords: keywords?.value,
                    description: FatwaById.question.substring(0, 200),
                    preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(FatwaById.title)}&description=${encodeURIComponent(`${FatwaById.question.substring(0, 200)}...`)}`,
                    id: id,
                    category: category,
                    FatwaById: FatwaById,
                };
                const pugPath = path.join(__dirname, './views/pages/fatwas_content.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

    app.get('/fataawa-search', async (request, response) => {
        try {
            const question = request?.query?.q;

            if (!question) {
                return response.status(400).json({ message: "Query parameter 'q' is required." });
            }

            console.log(removeArabicDiacritics(await removeStopWords(question)));

            const options = {
                keys: ['question', 'title', 'answer'], // الحقول التي سيتم البحث فيها
                threshold: 0.4, // حد الشبهية المطلوبة لإظهار النتائج
                ignoreLocation: false,
                includeScore: true
            };

            const fuse = new Fuse(fatwas, options);
            // دالة للبحث عن الكلمة المدخلة
            function searchFatwas(keyword) {
                const result = fuse.search(keyword);
                return result.map(({ item }) => item); // استرجاع العناصر المطابقة فقط
            }
            const results = searchFatwas(removeArabicDiacritics(await removeStopWords(question)));

            if (results.length > 0) {
                response.status(200).json(results.slice(0, 10));
            } else {
                response.status(404).json({ message: "No matching fatwa found." });
            }
        } catch (error) {
            console.error("Error processing question:", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

    app.get('/fataawa-get-category', async (request, response) => {
        try {
            const AllCategories = getAllCategories(fatwas);
            response.status(200).json(AllCategories);
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

    app.get('/fataawa-get-category-and-counts', async (request, response) => {
        try {
            const AllCategories = getCategorysWithCounts(fatwas);
            response.status(200).json(AllCategories);
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

    app.get('/fataawa-for-category', async (request, response) => {
        try {
            const targetCategory = request?.query?.targetCategory;

            if (!targetCategory) {
                return response.status(400).json({ message: "Query parameter 'targetCategory' is required." });
            }
            const AllCategories = getFatwasForCategory(fatwas, targetCategory);
            response.status(200).json(AllCategories);
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });
    app.get('/fataawa-by-id', async (request, response) => {
        try {
            const id = request?.query?.id;
            if (!id) {
                return response.status(400).json({ message: "Query parameter 'targetCategory' is required." });
            }
            const AllCategories = getFatwaById(fatwas, id);
            response.status(200).json(AllCategories);
        } catch (error) {
            console.error("Error: ", error);
            response.status(500).json({ message: "Internal server error.", error: `${error}` });
        }
    });

};