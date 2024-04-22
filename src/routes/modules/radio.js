import path from "node:path";

export default async (router, config, readFile) => {

  const radioJson = await readFile(path.join(config.paths.json, "radio.json"));

  router.get("/radio", (req, res) => {
    res.render("pages/radio", {
      options: {
        title: `موسوعة البث الإسلامي: ابحث واستمع إلى إذاعات القرآن والأحاديث والسنة - كنز الإسلام`,
        keywords: [
          "إذاعات القرآن",
          "إذاعات الأحاديث",
          "إذاعات السنة",
          "بث إسلامي",
          "تلاوة القرآن",
          "محاضرات إسلامية",
          "تفسير القرآن",
          "تعلم الدين",
          "مصادر إسلامية",
          "أصوات إسلامية",
          "دليل إذاعات إسلامية",
        ],
        description:
          "دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.",
        preview: `${config.domain}/static/images/preview-kanz.jpg`,
      },
    });
  });

  // TODO: REMOVE THIS !!! (AND REPLACE RADIO.JS CODE)
  router.get("/data-radio", (req, res) => {
    res.status(200).json(radioJson);
  });
};
