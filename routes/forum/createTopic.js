export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, analyzeText }) => {

    const {
        Users,
        Categories,
        Topics,
        Comments,
        Tags,
        Likes,
        Reports,
        Views,
        Notifications,
        Images,
        Videos,
        Audios,
    } = model;

    app.get('/create-topic', async (request, response) => {

        const queryCategoryId = request.query.category_id;

        if (queryCategoryId) {

            const category_id = convertToNumber(queryCategoryId);
            const existingCategory = await Categories.findOne({
                where: { category_id },
            }).catch((error) => {
                console.log(error);
            });
            const options = {};
            options.website_name = config.WEBSITE_NAME;
            options.title = `إنشاء موضوع جديد - ${config.WEBSITE_NAME}`;
            options.keywords = ["إنشاء موضوع جديد", "المنتدى", "المجتمع", "المشاركة في المناقشات", "طرح الأسئلة", "مشاركة الآراء", "المجتمع المنتدى", "كتابة موضوع", "كتابة مقال", "إنشاء مقالات"];
            options.description = "صفحة إنشاء موضوع جديد في المجتمع تهدف إلى تمكين المستخدمين من إنشاء مواضيع جديدة والمشاركة في المناقشات في المجتمع, يمكن للمستخدمين كتابة مواضيعهم الخاصة وطرح أسئلة أو مشاركة أفكارهم وآرائهم مع المجتمع";
            options.preview = `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("إنشاء موضوع جديد")}&description=${encodeURIComponent("صفحة إنشاء موضوع جديد في المجتمع تهدف إلى تمكين المستخدمين من إنشاء مواضيع جديدة والمشاركة في المناقشات في المجتمع, يمكن للمستخدمين كتابة مواضيعهم الخاصة وطرح أسئلة أو مشاركة أفكارهم وآرائهم مع المجتمع")}`;
            options.session = request.session;
            options.Category = existingCategory?.dataValues || {};
            options.FORUM = config?.FORUM;

            if (existingCategory?.dataValues?.category_id === category_id) {
                options.IsPermission = "قم بتسجيل الدخول لإنشاء موضوع جديد ❌";
                const pugPath = path.join(__dirname, './views/forum/createTopic.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }

            else {
                options.IsPermission = "ليس لديك إذن للوصول إلى الصفحة ❌";
                const pugPath = path.join(__dirname, './views/forum/createTopic.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }
        }

        else {
            const options = {};
            options.website_name = config.WEBSITE_NAME;
            options.title = `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`;
            options.keywords = ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"];
            options.description = "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.";
            options.preview = `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`)}&description=${encodeURIComponent("صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.")}`;
            options.status = 404;
            options.session = request.session;
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
        }


    });


    app.post('/create-topic', async (request, response) => {

        let title;
        const queryCategoryId = request.body.category_id;
        title = request.body?.title?.substring(0, config?.FORUM?.TITLE_LENGTH);
        const content = request.body?.content?.substring(0, config?.FORUM?.CONTENT_LENGTH);
        const content_raw = request.body?.content_raw?.substring(0, config?.FORUM?.CONTENT_LENGTH);
        const description = request.body?.description;
        const analyzeTextRaw = analyzeText(content_raw);
        const keywords = analyzeTextRaw?.words;
        const category_id = convertToNumber(queryCategoryId);

        if (request?.session?.isLoggedIn) {
            const existingCategory = await Categories.findOne({
                where: { category_id },
            }).catch((error) => {
                console.log(error);
            });
            if (existingCategory?.dataValues?.category_id === category_id) {

                const existingUsers = await Users.findOne({
                    where: { username: request?.session?.username },
                }).catch((error) => {
                    console.log(error);
                });
                const existingTopics = await Topics.findOne({
                    where: { title: title },
                }).catch((error) => {
                    console.log(error);
                });
                const lastTopicsId = await Topics.max('topic_id').catch((error) => {
                    console.log('حدث خطأ:', error);
                })
                const newTopicsId = lastTopicsId + 1;
                const lastTagsId = await Topics.max('topic_id').catch((error) => {
                    console.log('حدث خطأ:', error);
                });
                const newTagsId = lastTagsId + 1;

                if (existingTopics?.dataValues?.title === title) {
                    title = title + "#" + newTopicsId
                }

                // إضافة الكلمات الدالة في قاعدة البيانات
                await Tags.create({
                    tag_id: newTagsId,
                    topic_id: newTopicsId,
                    tag_name: keywords?.value
                }).catch((error) => {
                    console.log(error);
                });

                // إضافة الموضوع في قاعدة البيانات 
                await Topics.create({
                    topic_id: newTopicsId,
                    category_id: category_id,
                    user_id: existingUsers?.dataValues?.user_id,
                    title: title,
                    content: content,
                    content_raw: content_raw,
                    description: description ? description : title,
                    type: 'public', // private
                    hide: false
                }).catch((error) => {
                    console.log(error);
                });

                response.json({
                    isCreated: true,
                    title: title,
                    content: content,
                    content_raw: content_raw,
                    keywords: keywords,
                    topicUrl: `/forum/topic/${newTopicsId}`,
                    message: "لقد تم إنشاء الموضع بنجاح ✔️"
                });
            }

            else {
                response.json({
                    isCreated: false,
                    message: "خطأ, لم يتم إنشاء الموضوع"
                });
            }
        }

        else {
            response.json({
                isCreated: false,
                message: "يجب عليك تسجيل الدخول اولاُ"
            });
        }
    });
}


function convertToNumber(str) {
    let num = parseInt(str);
    if (isNaN(num)) {
        return false;
    } else {
        return num;
    }
}