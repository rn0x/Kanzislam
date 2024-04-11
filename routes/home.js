export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    app.get('/', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            CONTACT: config.CONTACT,
            title: `${config.WEBSITE_NAME} - منصة شاملة للقرآن والأذكار والأحاديث والتفاسير والمحتوى الإسلامي`,
            keywords: ["إسلام", "قرآن", "أذكار", "أحاديث", "منصة إسلامية", "فتاوى", "أوقات الصلاة", "تفسير", "مسبحة"],
            description: `${config.WEBSITE_NAME} هي منصة إسلامية شاملة تهدف إلى توفير القرآن الكريم والأذكار والأحاديث وغيرها من المحتوى الإسلامي بطريقة سهلة ومنظمة. توفر المنصة مجموعة واسعة من الموارد الدينية والتعليمية للمسلمين، استكشف ${config.WEBSITE_NAME} اليوم واستفد من محتواه القيم والموثوق.`,
            preview: `${config.WEBSITE_DOMAIN}/images/preview-kanz.jpg`,
        };
        const pugPath = path.join(__dirname, './views/home.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}