export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    app.get('/test', async (request, response) => {

        console.log(config);
        let options = {
            website_name: config.WEBSITE_NAME,
            title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("test")}&description=${encodeURIComponent("test")}`,
            session: request.session
        };
        let pugPath = path.join(__dirname, './views/test.pug');
        let render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}