import path from "node:path";
import readFile from "../utils/readFile.mjs";

import { Router } from "express";
const router = Router();

import { config } from "../config.mjs";

import analyzeText from "../utils/analyzeText.mjs";

const historyJson = await readFile(
  path.join(config.paths.json, "history.json")
);

router.get("/historical-events", (req, res) => {
  res.render("pages/history", {
    options: {
      isIndex: true,
      title: `تاريخ الإسلام ومسيرة المسلمين: أحداث تاريخية مهمة`,
      keywords: [
        "تاريخ الإسلام",
        "تاريخ المسلمين",
        "الأحداث التاريخية",
        "الإسلام والتاريخ",
        "المسلمون في التاريخ",
        "تطور الإسلام",
        "الإسلام في القرون الوسطى",
        "أحداث تاريخية إسلامية",
        "الحروب الإسلامية",
        "العصور الذهبية للإسلام",
        "الإسلام في العصور الحديثة",
        "المساهمات الإسلامية في التاريخ",
        "الإسلام والحضارة",
        "تأثير الإسلام على العالم",
        "الإسلام والفن والعلوم",
      ],
      description:
        "استكشف تاريخ الإسلام ومسار المسلمين من خلال مجموعة من الأحداث التاريخية البارزة. تعرف على الأحداث التي شكلت التاريخ الإسلامي وأثرت على مجتمع المسلمين على مر العصور.",
    },
  });
});

router.get("/historical-events/:id", async (req, res) => {
  const { id } = req.params;
  const findHistory = historyJson.find((e) => e.id === Number(id));

  if (!findHistory) {
    res.redirect("/404");
    return;
  }

  const analyze = analyzeText(findHistory?.title);
  const keywords = analyze?.words;

  res.render("pages/history", {
    options: {
      isIndex: false,
      historyJson: findHistory,
      title: findHistory?.title,
      keywords: keywords?.value,
      description: findHistory?.text?.substring(0, 200),
    },
  });
});

// Data History
router.get("/data-history", (req, res) => {
  res.status(200).json(historyJson);
});

export default router;
