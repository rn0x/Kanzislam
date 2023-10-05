export default (param) => {
    const { app, pug, path, fs, config, __dirname, jsStringify } = param;

    app.get('/quran', async (request, response) => {
        console.log(config.website_name);
        let options = {
            website_name: config.website_name,
            title: `عنوان الصفحة - ${config.website_name}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session
        };
        let pugPath = path.join(__dirname, './views/quran.pug');
        let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
        response.send(render);
    });

    app.get('/quran/:pathname', async (request, response) => {

        let pathname = request.params.pathname;
        let options = {
            website_name: config.website_name,
            title: `عنوان الصفحة - ${config.website_name}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session,
            pathname: pathname
        };
        let pugPath = path.join(__dirname, './views/quran_pathname.pug');
        let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
        response.send(render);
    });
}