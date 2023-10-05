export default async (param) => {

    param.app.get('/', async (request, response) => {

        const config = param.config;
        let options = {
            website_name: config.WEBSITE_NAME,
            title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session
        };
        let pugPath = param.path.join(param.__dirname, './views/home.pug');
        let render = param.pug.renderFile(pugPath, { options: options, jsStringify: param.jsStringify });
        response.send(render);
    });
}