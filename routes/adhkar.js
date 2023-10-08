export default async (param) => {

    const { app, pug, path, fs, config, __dirname, jsStringify } = param;

    let adhkarPath = path.join(__dirname, 'public/json/adhkar.json');
    let adhkarJson = await fs.readJson(adhkarPath).catch(() => ({}));
    let adhkarKey = Object.keys(adhkarJson);

    app.get('/adhkar', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session,
            adhkarJson: adhkarJson,
        };
        let pugPath = path.join(__dirname, './views/adhkar_box.pug');
        let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
        response.send(render);
    });

    app.get('/adhkar/:pathname', async (request, response) => {
        let pathname = request.params.pathname;
        let isPathAdhkar = adhkarKey.find((e) => adhkarJson[e]?.category?.split(" ")?.join("_") === pathname);

        if (isPathAdhkar) {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
                keywords: ["word1", "word2", "word3"],
                description: "وصف_الصفحة",
                preview: "صورة_المعاينة_للصفحة",
                session: request.session,
                adhkarJson: adhkarJson[isPathAdhkar],
            };
            let pugPath = path.join(__dirname, './views/adhkar.pug');
            let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
            response.send(render);
        }
        else {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                preview: "صورة_المعاينة_للصفحة",
                status: 404
            };
            let pugPath = path.join(__dirname, './views/Error.pug');
            let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
            response.status(404).send(render);
        }
    });

    app.get('/adhkars/:pathname', async (request, response) => {
        let pathname = request.params.pathname;
        let AdhkarObject = Object.values(adhkarJson).flatMap(item => item.array.filter(subItem => subItem.title.split(" ").join("_") === pathname).map(subItem => ({ category: item.category, ...subItem })))?.[0];

        if (AdhkarObject) {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `${AdhkarObject.title}- ${config.WEBSITE_NAME}`,
                keywords: ["word1", "word2", "word3"],
                description: `${AdhkarObject.category} - ${AdhkarObject.description}`,
                preview: "صورة_المعاينة_للصفحة",
                session: request.session,
                AdhkarObject: AdhkarObject,
            };
            let pugPath = path.join(__dirname, './views/adhkars.pug');
            let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
            response.send(render);
        }
        else {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                preview: "صورة_المعاينة_للصفحة",
                status: 404
            };
            let pugPath = path.join(__dirname, './views/Error.pug');
            let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
            response.status(404).send(render);
        }
    });
}