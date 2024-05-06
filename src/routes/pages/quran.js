import path from "node:path";

export default async (router, config, readFile, logger) => {

  const { logError } = logger;
  try {
    const quranPath = path.join(config.paths.json, 'quran_info.json');
    const surahPath = path.join(config.paths.json, 'surah.json');
    const mp3quranPath = path.join(config.paths.json, 'mp3quran.json');

    const quranJson = await readFile(quranPath);
    const surahJson = await readFile(surahPath);
    const mp3quranJson = await readFile(mp3quranPath);

    router.get("/quran", (req, res) => {
      res.render("pages/quran", {
        options: {
          title: `فهرس سور القرآن الكريم - قراءة واستماع`,
          keywords: ["سور القرآن الكريم", "قراءة القرآن", "استماع القرآن", "تفسير القرآن", "تلاوة القرآن", "ترتيل القرآن", "تفاسير سور القرآن", "مقاطع قرآنية", "تفسير سورة القرآن", "مواقع قراءة القرآن", "مواقع استماع القرآن", "قراءة القرآن بالتجويد", "استماع القرآن بأصوات مختلفة"],
          description: "فهرس لسور القرآن الكريم للقراءة والاستماع بصوت أكثر من 157 قارئ",
        },
      });
    });

    router.get("/quran/:pathname", (req, res) => {
      const { pathname } = req.params;
      const nameSurah = pathname?.split("سورة")?.join("")?.split("_")?.join(" ")?.trim();
      const currentSurah = quranJson.find(e => e.name === nameSurah);
      if (!currentSurah?.name) {
        res.redirect('/404');
        return
      }

      res.render("pages/quran_pathname", {
        options: {
          website_name: config.website_name,
          keywords: ["سور القرآن الكريم", "قراءة القرآن", "استماع القرآن", "تفسير القرآن", "تلاوة القرآن", "ترتيل القرآن", "تفاسير سور القرآن", "مقاطع قرآنية", "تفسير سورة القرآن", "مواقع قراءة القرآن", "مواقع استماع القرآن", "قراءة القرآن بالتجويد", "استماع القرآن بأصوات مختلفة"],
          title: `سورة ${currentSurah.name} قراءة وأستماع وتحميل mp3`,
          description: `سورة ${currentSurah.name} -  للقراءة والاستماع بصوت أكثر من 157 قارئ, ومعلومات حول السورة اين نزلت وكم عددة كلماتها وحروفها وآيتها وإسمها باللغة الإنجليزية`,
          currentSurah,
          nameSurah
        },
      });
    });

    // Data Quran
    router.get("/data-quran", (req, res) => {
      res.status(200).json({
        quranJson,
        mp3quranJson,
        surahJson,
      });
    });
  } catch (error) {
    logError(error);
  }
};
