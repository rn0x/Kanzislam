import path from "node:path";

export default async (router, config, readFile, logger) => {

  const { logError, logInfo } = logger;
  try {
    const radioJson = await readFile(path.join(config.paths.json, "radio.json"));

    router.get("/radio", (req, res) => {
      res.render("pages/radio", {
        options: {
          title: `موسوعة البث الإسلامي: ابحث واستمع إلى إذاعات القرآن والأحاديث والسنة`,
          keywords: ["إذاعات القرآن", "إذاعات الأحاديث", "إذاعات السنة", "بث إسلامي", "تلاوة القرآن", "محاضرات إسلامية", "تفسير القرآن", "تعلم الدين", "مصادر إسلامية", "أصوات إسلامية", "دليل إذاعات إسلامية"],
          description: "دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.",
          radioIndex: true
        },
      });
    });

    router.get("/radios/:id", (req, res) => {
      const { id } = req.params;
      const radioFind = radioJson.find((e) => e?.id === parseInt(id));

      if (!radioFind?.name) {
        res.redirect('/404');
        return
      }

      res.render("pages/radio", {
        options: {
          title: `الإذاعات الإسلامية: ${radioFind?.name}`,
          keywords: ["إذاعات القرآن", "إذاعات الأحاديث", "إذاعات السنة", "بث إسلامي", "تلاوة القرآن", "محاضرات إسلامية", "تفسير القرآن", "تعلم الدين", "مصادر إسلامية", "أصوات إسلامية", "دليل إذاعات إسلامية"],
          description: "دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.",
          radioIndex: false,
          radioJson: radioFind
        },
      });
    });

    // TODO: REMOVE THIS !!! (AND REPLACE RADIO.JS CODE)
    router.get("/data-radio", async (req, res) => {
      res.status(200).json(radioJson);
    });
  } catch (error) {
    logError(error);
  }
};
