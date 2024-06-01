import path from "node:path";
import readFile from "../utils/readFile.js";

import { Router } from "express";
const router = Router();

import { config } from "../config.js";

function findObjectByText(data, text) {
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    if (obj.array && obj.array.length > 0) {
      for (let j = 0; j < obj.array.length; j++) {
        if (removeArabicDiacritics(obj.array[j].text, 15) === text) {
          return {
            object: obj.array[j],
            category: obj.category,
          };
        }
      }
    }
  }
  return null;
}

function removeArabicDiacritics(sentence, itemWords) {
  // خريطة لإزالة الحركات العربية
  const diacriticsMap = {
    آ: "ا",
    أ: "ا",
    إ: "ا",
    اً: "ا",
    ٱ: "ا",
    ٲ: "ا",
    ٳ: "ا",
    ٵ: "ا",
    ٷ: "ؤ",
    ٹ: "ت",
    // أضف المزيد من الأحرف العربية والاستبدالات الخاصة بها حسب الحاجة
  };
  // تعريف التعبير العادي للحركات العربية
  const arabicDiacriticsRegex = /[\u064B-\u065F\u0670\u0610-\u061A]/g;
  // إزالة الحركات العربية من الجملة
  const withoutDiacritics = sentence?.replace(arabicDiacriticsRegex, "");
  // تقسيم الجملة إلى كلمات
  const words = withoutDiacritics?.split(/\s+/);
  // حدد عدد الكلمات المراد استخراجها
  const selectedWords = words?.slice(0, parseInt(itemWords));
  // استبدال الحروف العربية المعطوبة بالحروف الصحيحة
  const correctedWords = selectedWords?.map((word) =>
    word.replace(/./g, (char) => diacriticsMap[char] || char)
  );
  // انضمام الكلمات مرة أخرى بفاصلة
  const result = correctedWords?.join("_");
  // إزالة الأقواس والعلامات النهائية الأخرى
  return result
    ?.replace(/[\(\[\﴿]/g, "")
    .replace(/[\)\]\﴾]/g, "")
    .replace(/[\,\،\:\.]/g, "");
}

const hisnmuslimPath = path.join(config.paths.json, "hisnmuslim.json");
const hisnmuslimJson = await readFile(hisnmuslimPath);

router.get("/hisnmuslim", (req, res) => {
  res.render("pages/hisnmuslim", {
    options: {
      website_name: config.website_name,
      isAdhkarHisnMuslim: false,
      isHisText: false,
      isIndex: true,
      title: "فهرس حصن المسلم من أذكار الكتاب والسنة",
      keywords: [
        "حصن المسلم",
        "الأذكار اليومية",
        "الأذكار الإسلامية",
        "الدين الإسلامي",
        "أذكار الكتاب والسنة",
        "أذكار",
        "اذكاري",
        "اذكار  يومية",
        "حصن نفسك",
        "أذكار متنوعة",
        "أذكار المسلم",
        "أذكار صوتية",
      ],
      description:
        "“حصن المسلم”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.",
    },
  });
});

router.get("/hisnmuslim/:pathname", (req, res) => {
  const { pathname } = req.params;
  const category = pathname?.split("_")?.join(" ");
  const hisnmuslimFound = hisnmuslimJson.find(
    (item) => item?.category === category
  );

  if (!hisnmuslimFound) {
    res.redirect("/404");
    return;
  }

  res.render("pages/hisnmuslim", {
    options: {
      website_name: config.website_name,
      isAdhkarHisnMuslim: true,
      isHisText: false,
      isIndex: false,
      hisnmuslimFound,
      titleBox: hisnmuslimFound?.category,
      title: hisnmuslimFound?.category,
      keywords: [
        "حصن المسلم",
        "الأذكار اليومية",
        "الأذكار الإسلامية",
        "الدين الإسلامي",
        "أذكار الكتاب والسنة",
        "أذكار",
        "اذكاري",
        "اذكار  يومية",
        "حصن نفسك",
        "أذكار متنوعة",
        "أذكار المسلم",
        "أذكار صوتية",
      ],
      description: `“حصن المسلم - ${hisnmuslimFound?.category}”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.`,
    },
  });
});

router.get("/hisnmuslims/:pathname", (req, res) => {
  const { pathname } = req.params;
  const title = pathname?.split("_").join(" ");
  const isTitleFind = findObjectByText(hisnmuslimJson, pathname);

  if (!isTitleFind) {
    res.redirect("/404");
    return;
  }

  res.render("pages/hisnmuslim", {
    options: {
      website_name: config.website_name,
      isAdhkarHisnMuslim: false,
      isHisText: true,
      isIndex: false,
      titleBox: `${isTitleFind?.category} - ${isTitleFind?.object?.id}`,
      ObjectHis: isTitleFind?.object,
      category: isTitleFind?.category,
      title: title,
      keywords: [
        "حصن المسلم",
        "الأذكار اليومية",
        "الأذكار الإسلامية",
        "الدين الإسلامي",
        "أذكار الكتاب والسنة",
        "أذكار",
        "اذكاري",
        "اذكار  يومية",
        "حصن نفسك",
        "أذكار متنوعة",
        "أذكار المسلم",
        "أذكار صوتية",
      ],
      description: `“حصن المسلم” : ${
        isTitleFind?.object?.text ? isTitleFind?.text : title
      }.`,
    },
  });
});

// Data Hisn almuslim
router.get("/data-hisnmuslim", (req, res) => {
  res.status(200).json(hisnmuslimJson);
});

export default router;
