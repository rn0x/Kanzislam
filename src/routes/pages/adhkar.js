import path from "node:path";

export default async (router, config, readFile) => {

  router.get("/adhkar", (req, res) => {
    res.render("pages/adhkar_box", {
      options: {
        title: `أذكار الصباح والمساء والنوم والصلاة والطعام: دليلك اليومي للتذكير`,
        keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
        description: "تعتبر صفحة الأذكار مصدرًا رائعًا للتأمل والتفكير. تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في أوقات مختلفة من اليوم.",
      },
    });
  });

  router.get("/adhkar/:pathname", async (req, res) => {
    const pathname = req.params.pathname;
    res.render("pages/adhkar", {
      options: {
        pathname: pathname,
        keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
      },
    });
  });

  router.get("/adhkars/:pathname", async (req, res) => {
    const pathname = req.params.pathname;
    res.render("pages/adhkars", {
      options: {
        pathname: pathname,
        keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
      },
    });
  });

  // Data Adhkar
  router.get("/data-adhkar", async (req, res) => {
    const adhkarJson = await readFile(path.join(config.paths.json, "adhkar.json"));
    res.status(200).json(adhkarJson);
  });
};