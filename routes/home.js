export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    app.get('/', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `${config.WEBSITE_NAME} - منصة شاملة للقرآن والأذكار والأحاديث والتفاسير والمحتويات الإسلامية`,
            keywords: ["إسلام", "قرآن", "أذكار", "أحاديث", "منصة إسلامية", "فتاوى", "أوقات الصلاة", "تفسير", "مسبحة"],
            description: `${config.WEBSITE_NAME} هي منصة إسلامية شاملة تهدف إلى توفير القرآن الكريم والأذكار والأحاديث وغيرها من المحتويات الإسلامية بطريقة سهلة ومنظمة. توفر المنصة مجموعة واسعة من الموارد الدينية والتعليمية للمسلمين، استكشف ${config.WEBSITE_NAME} اليوم واستفد من محتواه القيم والموثوق.`,
            preview: "صورة_المعاينة_للصفحة",
            session: request.session
        };
        let pugPath = path.join(__dirname, './views/home.pug');
        let render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}