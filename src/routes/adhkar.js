import path from "node:path";
import readFile from "../utils/readFile.js";

import { Router } from "express";
const router = Router();

import { config } from "../config.js";

const adhkarJson = await readFile(path.join(config.paths.json, "adhkar.json"));
const adhkarKey = Object.keys(adhkarJson);

router.get("/adhkar", (req, res) => {
  res.render("pages/adhkar_box", {
    options: {
      title: `أذكار الصباح والمساء والنوم والصلاة والطعام: دليلك اليومي للتذكير`,
      keywords: [
        "أذكار الصباح",
        "أذكار المساء",
        "أذكار النوم",
        "أذكار الطعام",
        "أذكار الصلاة",
        "التسابيح",
        "الدعاء اليومي",
        "الإسلام",
        "القرآن",
        "الحديث",
        "الإيمان",
      ],
      description:
        "تعتبر صفحة الأذكار مصدرًا رائعًا للتأمل والتفكير. تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في أوقات مختلفة من اليوم.",
    },
  });
});

router.get("/adhkar/:pathname", (req, res) => {
  const pathname = req.params.pathname;
  const currentAdhkarKey = adhkarKey.find(
    (e) => adhkarJson[e]?.category?.split(" ")?.join("_") === pathname
  );
  const currentAdhkar = adhkarJson[currentAdhkarKey];

  if (!currentAdhkar?.category) {
    res.redirect("/404");
    return;
  }
  res.render("pages/adhkar", {
    options: {
      title: `${currentAdhkar.category}`,
      keywords: [
        "أذكار الصباح",
        "أذكار المساء",
        "أذكار النوم",
        "أذكار الطعام",
        "أذكار الصلاة",
        "التسابيح",
        "الدعاء اليومي",
        "الإسلام",
        "القرآن",
        "الحديث",
        "الإيمان",
      ],
      description: `تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في ${currentAdhkar.category}.`,
      website_name: config.website_name,
      pathname: pathname,
    },
  });
});

router.get("/adhkars/:pathname", (req, res) => {
  const pathname = req.params.pathname;
  const AdhkarObject = Object.values(adhkarJson).flatMap((item) =>
    item.array
      .filter((subItem) => subItem.title.split(" ").join("_") === pathname)
      .map((subItem) => ({ category: item.category, ...subItem }))
  )?.[0];

  if (!AdhkarObject?.title) {
    res.redirect("/404");
    return;
  }

  res.render("pages/adhkars", {
    options: {
      title: `${AdhkarObject.title}`,
      description: `${AdhkarObject.category} - ${AdhkarObject.description}`,
      website_name: config.website_name,
      pathname: pathname,
      keywords: [
        "أذكار الصباح",
        "أذكار المساء",
        "أذكار النوم",
        "أذكار الطعام",
        "أذكار الصلاة",
        "التسابيح",
        "الدعاء اليومي",
        "الإسلام",
        "القرآن",
        "الحديث",
        "الإيمان",
      ],
    },
  });
});

// Data Adhkar
router.get("/data-adhkar", (req, res) => {
  res.status(200).json(adhkarJson);
});

export default router;
