export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    const radioPath = path.join(__dirname, 'public/json/radio.json');
    const radioJson = await fs.readJson(radioPath).catch(() => ({}));

    app.get('/radio', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            CONTACT: config.CONTACT,
            title: `موسوعة البث الإسلامي: ابحث واستمع إلى إذاعات القرآن والأحاديث والسنة - ${config.WEBSITE_NAME}`,
            keywords: ["إذاعات القرآن", "إذاعات الأحاديث", "إذاعات السنة", "بث إسلامي", "تلاوة القرآن", "محاضرات إسلامية", "تفسير القرآن", "تعلم الدين", "مصادر إسلامية", "أصوات إسلامية", "دليل إذاعات إسلامية"],
            description: "دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("موسوعة البث الإسلامي: ابحث واستمع إلى إذاعات القرآن والأحاديث والسنة")}&description=${encodeURIComponent("دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.")}`,
        };
        const pugPath = path.join(__dirname, './views/pages/radio.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/radios/:id', async (request, response) => {

        const { id } = request.params;
        const radioFind = radioJson.find((e) => e?.id === parseInt(id));

        const options = {
            website_name: config.WEBSITE_NAME,
            CONTACT: config.CONTACT,
            title: `الإذاعات الإسلامية: ${radioFind?.name} - ${config.WEBSITE_NAME}`,
            keywords: ["إذاعات القرآن", "إذاعات الأحاديث", "إذاعات السنة", "بث إسلامي", "تلاوة القرآن", "محاضرات إسلامية", "تفسير القرآن", "تعلم الدين", "مصادر إسلامية", "أصوات إسلامية", "دليل إذاعات إسلامية"],
            description: "دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`الإذاعات الإسلامية: ${radioFind?.name}`)}&description=${encodeURIComponent("دليل البث الإسلامي الشامل، حيث يمكنك العثور على مصادر إذاعات القرآن والأحاديث والسنة الإسلامية. استمتع بالاستماع إلى المقرئين والعلماء الرائعين وتعزيز فهمك للدين الإسلامي من خلال هذه الإذاعات المميزة.")}`,
            radioJson: radioFind
        };
        const pugPath = path.join(__dirname, './views/pages/radios.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/data-radio', async (request, response) => {
        response.status(200).json(radioJson);
    });
}