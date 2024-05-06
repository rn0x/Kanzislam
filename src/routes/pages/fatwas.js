import path from "node:path";
import Fuse from "fuse.js";
import analyzeText from "../../utils/analyzeText.js";
import {
  removeStopWords,
  removeArabicDiacritics,
} from "../../utils/textUtils.js";
import {
  getAllCategories,
  getCategorysWithCounts,
  getFatwasForCategory,
  getFatwaById,
} from "../../utils/fatawaUtils.js";

// دالة للبحث عن الكلمة المدخلة
function searchFatwas(keyword) {
  const result = fuse.search(keyword);
  return result.map(({ item }) => item); // استرجاع العناصر المطابقة فقط
}

export default async (router, config, readFile, logger) => {
  const { logError } = logger;
  try {
    const fatwas = await readFile(path.join(config.paths.json, "fatwas.json"));

    router.get("/fataawa-ibn-baaz", (req, res) => {
      res.render("pages/fatwas", {
        options: {
          title: `موسوعة الفتاوى الإسلامية للشيخ إبن باز`,
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
          description:
            "موسوعة شاملة للفتاوى الإسلامية للشيخ ابن باز رحمه الله, تغطي جميع المواضيع الدينية والقضايا الشرعية بدقة وموضوعية، تقدم إجابات دقيقة وموثوقة لاستفساراتك الدينية.",
        },
      });
    });

    router.get("/fataawa-ibn-baaz/:category", (req, res) => {
      try {
        const category = req.params.category.replace(/_/g, " ");
        const fatwasArray = getFatwasForCategory(fatwas, category);

        if (fatwasArray.length === 0) {
          res.redirect("/404");
          return;
        }

        res.render("pages/fatwas_category", {
          options: {
            title: `موسوعة الفتاوى المتعلقة ب${category}`,
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
            category: category,
            fatwasArray: fatwasArray,
          },
        });
      } catch (error) {
        logger(error);
      }
    });

    router.get("/fataawa-ibn-baaz/:category/:id", (req, res) => {
      try {
        const category = req.params.category.replace(/_/g, " ");
        const id = req.params.id;
        const fatwasArray = getFatwasForCategory(fatwas, category);
        const FatwaById = getFatwaById(fatwas, id);

        if (fatwasArray.length === 0 || !FatwaById) {
          res.redirect("/404");
          return;
        }

        const analyze = analyzeText(FatwaById.question);
        const keywords = analyze?.words;

        res.render("pages/fatwas_content", {
          options: {
            title: `فتوى ${FatwaById.title} للشيخ ابن باز`,
            keywords: keywords?.value,
            description: FatwaById.question.substring(0, 200),
            id: id,
            category: category,
            FatwaById: FatwaById,
          },
        });
      } catch (error) {
        logError(error);
      }
    });

    router.get("/fataawa-search", async (req, res) => {
      try {
        const question = req?.query?.q;

        if (!question) {
          return res
            .status(400)
            .json({ message: "Query parameter 'q' is required." });
        }

        console.log(removeArabicDiacritics(await removeStopWords(question)));

        const options = {
          keys: ["question", "title", "answer"], // الحقول التي سيتم البحث فيها
          threshold: 0.4, // حد الشبهية المطلوبة لإظهار النتائج
          ignoreLocation: false,
          includeScore: true,
        };

        const fuse = new Fuse(fatwas, options);

        const results = searchFatwas(
          removeArabicDiacritics(await removeStopWords(question))
        );

        if (results.length > 0) {
          res.status(200).json(results.slice(0, 10));
        } else {
          res.status(404).json({ message: "No matching fatwa found." });
        }
      } catch (error) {
        logError(error);
        res
          .status(500)
          .json({ message: "Internal server error.", error: `${error}` });
      }
    });

    router.get("/fataawa-get-category", (req, res) => {
      try {
        const AllCategories = getAllCategories(fatwas);
        res.status(200).json(AllCategories);
      } catch (error) {
        logError(error);
        res
          .status(500)
          .json({ message: "Internal server error.", error: `${error}` });
      }
    });

    router.get("/fataawa-get-category-and-counts", (req, res) => {
      try {
        const Categories = getCategorysWithCounts(fatwas);
        res.status(200).json(Categories);
      } catch (error) {
        logError(error);
        res
          .status(500)
          .json({ message: "Internal server error.", error: `${error}` });
      }
    });

    router.get("/fataawa-for-category", (req, res) => {
      try {
        const targetCategory = req?.query?.targetCategory;

        if (!targetCategory) {
          return res
            .status(400)
            .json({ message: "Query parameter 'targetCategory' is required." });
        }
        const FatwasForCategory = getFatwasForCategory(fatwas, targetCategory);
        res.status(200).json(FatwasForCategory);
      } catch (error) {
        logError(error);
        res
          .status(500)
          .json({ message: "Internal server error.", error: `${error}` });
      }
    });

    router.get("/fataawa-by-id", (req, res) => {
      try {
        const id = req?.query?.id;
        if (!id) {
          return res
            .status(400)
            .json({ message: "Query parameter 'targetCategory' is required." });
        }
        const getFatwa = getFatwaById(fatwas, id);
        res.status(200).json(getFatwa);
      } catch (error) {
        logError(error);
        res
          .status(500)
          .json({ message: "Internal server error.", error: `${error}` });
      }
    });
  } catch (error) {
    logError(error);
  }
};
