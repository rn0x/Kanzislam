import path from "node:path";
import readFile from "../utils/readFile.mjs";

import { Router } from "express";
const router = Router();

import { config } from "../config.mjs";
import { logError } from "../utils/logger.mjs";

import analyzeText from "../utils/analyzeText.mjs";
import {
  getCategorysWithCounts,
  getFatwasForCategory,
  getFatwaById,
} from "../utils/fatawaUtils.mjs";

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

export default router;
