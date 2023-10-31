import error from "../error.js";

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, analyzeText, filterSpan }) => {

    const historyPath = path.join(__dirname, 'public/json/history.json');
    const historyJson = await fs.readJson(historyPath).catch(() => ({}));

    app.get('/historical-events', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `تاريخ الإسلام ومسيرة المسلمين: أحداث تاريخية مهمة - ${config.WEBSITE_NAME}`,
            keywords: ["تاريخ الإسلام", "تاريخ المسلمين", "الأحداث التاريخية", "الإسلام والتاريخ", "المسلمون في التاريخ", "تطور الإسلام", "الإسلام في القرون الوسطى", "أحداث تاريخية إسلامية", "الحروب الإسلامية", "العصور الذهبية للإسلام", "الإسلام في العصور الحديثة", "المساهمات الإسلامية في التاريخ", "الإسلام والحضارة", "تأثير الإسلام على العالم", "الإسلام والفن والعلوم"],
            description: "استكشف تاريخ الإسلام ومسار المسلمين من خلال مجموعة من الأحداث التاريخية البارزة. تعرف على الأحداث التي شكلت التاريخ الإسلامي وأثرت على مجتمع المسلمين على مر العصور.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("تاريخ الإسلام ومسيرة المسلمين: أحداث تاريخية مهمة")}&description=${encodeURIComponent("استكشف تاريخ الإسلام ومسار المسلمين من خلال مجموعة من الأحداث التاريخية البارزة. تعرف على الأحداث التي شكلت التاريخ الإسلامي وأثرت على مجتمع المسلمين على مر العصور.")}`,
            session: request.session
        };
        const pugPath = path.join(__dirname, './views/pages/history.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/historical-events/:id', async (request, response) => {
        const { id } = request.params;
        const findHistory = historyJson.find(e => e.id === Number(id));

        if (findHistory) {
            const analyze = analyzeText(findHistory?.title);
            const keywords = analyze?.words;
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `${findHistory?.title} - ${config.WEBSITE_NAME}`,
                keywords: keywords?.value,
                description: findHistory?.text?.substring(0, 200),
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(findHistory?.title)}&description=${encodeURIComponent(findHistory?.text?.substring(0, 200)+"...")}`,
                session: request.session,
                historyJson: findHistory,
                filterSpan: filterSpan
            };
            const pugPath = path.join(__dirname, './views/pages/history_id.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }
    });

    app.get('/data-history', async (request, response) => {
        const existsSync = fs.existsSync(historyPath);
        if (existsSync) {
            response.status(200).json(historyJson);
        } else {
            response.status(404).json({ messgae: "ملف الاحداث التاريخيه غير موجود !!" });
        }
    });
}