export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model }) => {

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

    app.get('/create-topic', async (request, response) => {

        const queryCategoryId = request.query.category_id;
        const category_id = convertToNumber(queryCategoryId);
        const existingCategory = await Categories.findOne({
            where: { category_id },
        });
        const options = {};
        options.website_name = config.WEBSITE_NAME;
        options.title = `إنشاء موضوع جديد - ${config.WEBSITE_NAME}`;
        options.keywords = ["إنشاء موضوع جديد", "المنتدى", "المجتمع", "المشاركة في المناقشات", "طرح الأسئلة", "مشاركة الآراء", "المجتمع المنتدى", "كتابة موضوع", "كتابة مقال", "إنشاء مقالات"];
        options.description = "صفحة إنشاء موضوع جديد في المجتمع تهدف إلى تمكين المستخدمين من إنشاء مواضيع جديدة والمشاركة في المناقشات في المجتمع, يمكن للمستخدمين كتابة مواضيعهم الخاصة وطرح أسئلة أو مشاركة أفكارهم وآرائهم مع المجتمع";
        options.preview = "صورة_المعاينة_للصفحة";
        options.session = request.session;
        options.Category = existingCategory?.dataValues || {};

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

    });


    app.post('/create-topic', async (request, response) => {

        let title;
        const queryCategoryId = request.body.category_id;
        title = request.body?.title?.substring(0, 80);
        const content = request.body?.content?.substring(0, 6000);
        const category_id = convertToNumber(queryCategoryId);

        if (request?.session?.isLoggedIn) {
            const existingCategory = await Categories.findOne({
                where: { category_id },
            });
            if (existingCategory?.dataValues?.category_id === category_id) {

                const existingUsers = await Users.findOne({
                    where: { username: request?.session?.username },
                });
                const existingTopics = await Topics.findOne({
                    where: { title: title },
                });
                const lastTopicsId = await Topics.max('topic_id').catch((error) => {
                    console.log('حدث خطأ:', error);
                });
                const newTopicsId = lastTopicsId + 1;

                if (existingTopics?.dataValues?.title === title) {
                    title = title + "#" + newTopicsId
                }
                await Topics.create({
                    topic_id: newTopicsId,
                    category_id: category_id,
                    user_id: existingUsers?.dataValues?.user_id,
                    title: title,
                    content: content,
                    description: content?.substring(0, 150),
                    type: 'public', // private
                    hide: false
                });
                response.json({
                    isCreated: true,
                    title: title,
                    content: content,
                    topicUrl: `/forum/${existingCategory?.dataValues?.title?.replace(/ /g, '_')}/${title?.replace(/ /g, '_')}`,
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