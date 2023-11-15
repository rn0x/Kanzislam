import extractImagesFromHtml from "../../modules/extractImagesFromHtml.js";
import error from "../error.js";

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
            await error({ config, request, path, response, __dirname, pug, jsStringify });
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
        const images = await extractImagesFromHtml(content).catch((error) => console.log(error));

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

                if (existingTopics?.title === title) {
                    title = title + "#" + newTopicsId;
                }

                // إضافة الموضوع في قاعدة البيانات 
                const CreateTopics = await Topics.create({
                    category_id: category_id,
                    user_id: existingUsers?.dataValues?.user_id,
                    title: title,
                    content: content,
                    content_raw: content_raw,
                    description: description ? description : title,
                    type: 'public', // private
                    hide: false,
                    images: images
                }).catch((error) => {
                    console.log(error);
                });

                // إضافة الكلمات الدالة في قاعدة البيانات
                await Tags.create({
                    topic_id: CreateTopics?.topic_id,
                    tag_name: keywords?.value
                }).catch((error) => {
                    console.log(error);
                });

                response.json({
                    isCreated: true,
                    title: title,
                    content: content,
                    content_raw: content_raw,
                    keywords: keywords,
                    topicUrl: `/forum/topic/${CreateTopics?.topic_id}`,
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