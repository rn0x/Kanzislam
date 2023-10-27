export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    const radioPath = path.join(__dirname, 'public/json/radio.json');
    const radioJson = await fs.readJson(radioPath).catch(() => ({}));

    app.get('/radio', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `الإذاعات الإسلامية: دليلك لإذاعات القرآن والأحاديث والسنة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("test")}&description=${encodeURIComponent("test")}`,
            session: request.session
        };
        const pugPath = path.join(__dirname, './views/radio.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/radios/:id', async (request, response) => {

        const { id } = request.params;
        const radioFind = radioJson.find((e) => e?.id === parseInt(id));

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `الإذاعات الإسلامية: دليلك لإذاعات القرآن والأحاديث والسنة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("test")}&description=${encodeURIComponent("test")}`,
            session: request.session,
            radioJson: radioFind
        };
        const pugPath = path.join(__dirname, './views/radios.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/data-radio', async (request, response) => {
        response.status(200).json(radioJson);
    });
}