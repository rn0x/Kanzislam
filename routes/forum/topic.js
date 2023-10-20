export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, convertToNumber, database, analyzeText }) => {

    const {
        Users,
        Categories,
        Topics,
        Comments,
        Tags,
        Likes,
        Favorites,
        Reports,
        Views,
        Notifications,
        Images,
        Videos,
        Audios,
        Statistics
    } = model;

    app.get('/forum/topic/:topic', async (request, response) => {

        const topic = convertToNumber(request.params?.topic?.trim());
        const GetTopic = await database.getTopicAndComments(topic);

        if (topic && GetTopic) {
            console.log(GetTopic);
            // إضافة مشاهدات الموضوع في قاعدة البيانات
            const lastViewsId = await Views.max('view_id').catch((error) => {
                console.log('حدث خطأ:', error);
            });
            const newViewsId = lastViewsId + 1;
            await Views.create({
                view_id: newViewsId,
                topic_id: topic
            }).catch((error) => {
                console.log(error);
            });


            const options = {};
            options.website_name = config.WEBSITE_NAME;
            options.title = `${GetTopic?.topic?.title}- ${config.WEBSITE_NAME}`;
            options.keywords = ["word1", "word2", "word3"];
            options.description = "وصف_الصفحة";
            options.preview = GetTopic?.topic?.description;
            options.session = request.session;
            options.TopicJosn = GetTopic;
            const pugPath = path.join(__dirname, './views/forum/topic.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }

        else {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                preview: "صورة_المعاينة_للصفحة",
                status: 404
            };
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
        }

    });
}