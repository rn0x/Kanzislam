export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    app.get('/forum', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `مجتمع ${config.WEBSITE_NAME}: منصة تفاعلية للمعرفة والتواصل الإسلامي`,
            keywords: ["مجتمع إسلامي", "محتوى ثقافي إسلامي", "تعليم إسلامي", "منتديات إسلامية", "مقالات إسلامية", "تواصل إسلامي", "تعاون إسلامي", "موارد تعليمية إسلامية", "مدونات إسلامية"],
            description: `مجتمع ${config.WEBSITE_NAME} هي منصة مجتمعية عبر الإنترنت تهدف إلى توفير محتوى ثقافي وتعليمي إسلامي شامل ومتنوع. يوفر المجتمع مساحة للمشاركة والتفاعل بين المستخدمين من خلال المنتديات والمدونات والمقالات والموارد التعليمية. يهدف المجتمع إلى تعزيز الفهم الصحيح للإسلام وتعزيز التواصل والتعاون بين أفراد المجتمع الإسلامي.`,
            preview: "صورة_المعاينة_للصفحة",
            session: request.session
        };
        let pugPath = path.join(__dirname, './views/forum.pug');
        let render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}