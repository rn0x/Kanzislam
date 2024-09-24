import path from "node:path";
import readFile from "../utils/readFile.mjs";

import { Router } from "express";
const router = Router();

import { config } from "../config.mjs";

const tafsir_name_path = path.join(
  config.paths.json,
  "tafsir/tafsir_name.json"
);
const quranPath = path.join(config.paths.json, "quran_info.json");
const ayatPath = path.join(config.paths.json, "ayat.json");
const tafsir_name_json = await readFile(tafsir_name_path);
const quranJson = await readFile(quranPath);
const ayatJson = await readFile(ayatPath);

router.get("/tafsir-quran", (req, res, next) => {
  res.render("pages/tafsir", {
    options: {
      tafsir_name: tafsir_name_json,
      title: `تفاسير القرآن الكريم - الطبري, ابن كثير، السعدي، القرطبي، البغوي، ابن عاشور والمزيد`,
      keywords: [
        "تفاسير القرآن",
        "تفسير",
        "تفسير القران",
        "الطبري",
        "ابن كثير",
        "السعدي",
        "القرطبي",
        "البغوي",
        "ابن عاشور",
        "الأعلام القرآنية",
        "تفسير القرآن الكريم",
        "تفاسير إسلامية",
        "تفسير آيات القرآن",
        "تفسير القرآن الكريم باللغة العربية",
        "علماء الإسلام",
        "فهم القرآن",
        "تفسير القرآن باللغة العربية",
        "معاني القرآن",
        "تفاسير قرآنية",
        "تفسير سور القرآن",
        "مفهوم القرآن",
        "تفاسير مشهورة",
      ],
      description:
        "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
    },
  });
});

router.get("/tafsir-quran/:tfs", (req, res, next) => {
  const { tfs } = req.params;
  const tafsir = tafsir_name_json.find((e) => e?.name_english === tfs);

  if (!tafsir) {
    res.redirect("/404");
    return;
  }

  res.render("pages/tafsir", {
    options: {
      tafsir_name: tafsir_name_json,
      tafsir,
      title: `تفاسير القرآن الكريم - الطبري, ابن كثير، السعدي، القرطبي، البغوي، ابن عاشور والمزيد`,
      keywords: [
        "تفاسير القرآن",
        "تفسير",
        "تفسير القران",
        "الطبري",
        "ابن كثير",
        "السعدي",
        "القرطبي",
        "البغوي",
        "ابن عاشور",
        "الأعلام القرآنية",
        "تفسير القرآن الكريم",
        "تفاسير إسلامية",
        "تفسير آيات القرآن",
        "تفسير القرآن الكريم باللغة العربية",
        "علماء الإسلام",
        "فهم القرآن",
        "تفسير القرآن باللغة العربية",
        "معاني القرآن",
        "تفاسير قرآنية",
        "تفسير سور القرآن",
        "مفهوم القرآن",
        "تفاسير مشهورة",
      ],
      description:
        "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
    },
  });
});

router.get("/tafsir-quran/:tfs/:surah/", (req, res, next) => {
  const { tfs, surah } = req.params;
  const tafsir = tafsir_name_json.find((e) => e?.name_english === tfs);
  const quranSurah = quranJson.find((e) => e?.number === Number(surah));

  if (!tafsir || !quranSurah) {
    res.redirect("/404");
    return;
  }

  res.render("pages/tafsir_surah", {
    options: {
      tafsir_name: tafsir_name_json,
      tafsir,
      surah: quranSurah,
      title: `تفسير القرآن الكريم (${tafsir?.name}) : سورة ${quranSurah?.name}`,
      keywords: [
        "تفاسير القرآن",
        "تفسير",
        "تفسير القران",
        "الطبري",
        "ابن كثير",
        "السعدي",
        "القرطبي",
        "البغوي",
        "ابن عاشور",
        "الأعلام القرآنية",
        "تفسير القرآن الكريم",
        "تفاسير إسلامية",
        "تفسير آيات القرآن",
        "تفسير القرآن الكريم باللغة العربية",
        "علماء الإسلام",
        "فهم القرآن",
        "تفسير القرآن باللغة العربية",
        "معاني القرآن",
        "تفاسير قرآنية",
        "تفسير سور القرآن",
        "مفهوم القرآن",
        "تفاسير مشهورة",
      ],
      description:
        "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
    },
  });
});

router.get("/tafsir-quran/:tfs/:surah/:ayah", async (req, res, next) => {
  const { tfs, surah, ayah } = req.params;
  const tafsir = tafsir_name_json.find((e) => e?.name_english === tfs);
  const quranSurah = quranJson.find((e) => e?.number === Number(surah));
  const Surah = ayatJson.find((e) => e?.id === Number(surah));
  const quranAyah = Surah.ayat.find((e) => e?.id === Number(ayah));

  if (!tafsir || !quranSurah || !quranAyah) {
    res.redirect("/404");
    return;
  }

  const tafsirPath = path.join(
    config.paths.json,
    `tafsir/${tafsir?.name_english}.json`
  );
  const tafsirJson = await readFile(tafsirPath);
  const tafsirContent = tafsirJson.tafsir.find(
    (e) => e?.surah === Number(surah) && e?.ayah === Number(ayah)
  );

  res.render("pages/tafsir_ayah", {
    options: {
      tafsir: tafsir,
      surah: quranSurah,
      ayah: quranAyah,
      tafsirContent: tafsirContent?.text,
      title: `تفسير القرآن الكريم (${tafsir?.name}) : سورة ${quranSurah?.name} آية رقم ${ayah}`,
      keywords: [
        "تفاسير القرآن",
        "تفسير",
        "تفسير القران",
        "الطبري",
        "ابن كثير",
        "السعدي",
        "القرطبي",
        "البغوي",
        "ابن عاشور",
        "الأعلام القرآنية",
        "تفسير القرآن الكريم",
        "تفاسير إسلامية",
        "تفسير آيات القرآن",
        "تفسير القرآن الكريم باللغة العربية",
        "علماء الإسلام",
        "فهم القرآن",
        "تفسير القرآن باللغة العربية",
        "معاني القرآن",
        "تفاسير قرآنية",
        "تفسير سور القرآن",
        "مفهوم القرآن",
        "تفاسير مشهورة",
      ],
      description:
        "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
    },
  });
});

export default router;
