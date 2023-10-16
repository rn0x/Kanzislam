export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, database }) => {

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

    app.get('/forum', async (request, response) => {

        const getAllCategories = await Categories.findAll();
        const getAllTopics = await Topics.findAll();
        const getAllComments = await Comments.findAll();
        const options = {};
        options.title = `مجتمع ${config.WEBSITE_NAME}: منصة تفاعلية للمعرفة والتواصل الإسلامي`;
        options.keywords = ["مجتمع إسلامي", "محتوى ثقافي إسلامي", "تعليم إسلامي", "منتديات إسلامية", "مقالات إسلامية", "تواصل إسلامي", "تعاون إسلامي", "موارد تعليمية إسلامية", "مدونات إسلامية"];
        options.description = `مجتمع ${config.WEBSITE_NAME} هي منصة مجتمعية عبر الإنترنت تهدف إلى توفير محتوى ثقافي وتعليمي إسلامي شامل ومتنوع. يوفر المجتمع مساحة للمشاركة والتفاعل بين المستخدمين من خلال المنتديات والمدونات والمقالات والموارد التعليمية. يهدف المجتمع إلى تعزيز الفهم الصحيح للإسلام وتعزيز التواصل والتعاون بين أفراد المجتمع الإسلامي.`;
        options.preview = "صورة_المعاينة_للصفحة";
        options.session = request.session;
        options.getAllCategories = getAllCategories.map(category => {
            const category_id = category.category_id;
            const title = category.title;
            const description = category.description;
            const counttopics = getAllTopics.filter(topic => topic.category_id === category_id).length;
            const countcomments = getAllComments.filter(comment => {
                const topic = getAllTopics.find(topic => topic.topic_id === comment.topic_id);
                return topic && topic.category_id === category_id;
            }).length;

            return {
                category_id,
                title,
                description,
                counttopics,
                countcomments
            };
        });
        const pugPath = path.join(__dirname, './views/forum/index.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/forum/:categorie', async (request, response) => {
        const categorie = request.params?.categorie?.replace(/_/g, ' ');
        const getCategorie = await Categories.findOne({
            where: { title: categorie },
        });
        const options = {};
        // await Topics.create({
        //     topic_id: 2,
        //     category_id: 1,
        //     user_id: 1,
        //     title: 'Example Topic',
        //     content: 'This is the content of the topic',
        //     description: 'This is a description of the topic',
        //     type: 'Discussion',
        //     images: [
        //         {
        //             link: "htpps://www.example.com/file.jpeg",
        //             size: 5678987,
        //             filename: "example.jpeg"
        //         },
        //         {
        //             link: "htpps://www.example.com/image.jpeg",
        //             size: 565434,
        //             filename: "image.jpeg"
        //         }
        //     ]
        // }).catch((error) => {
        //     console.error('Error creating topic:', error);
        // });
        if (getCategorie?.dataValues) {
            options.website_name = config.WEBSITE_NAME;
            options.title = `${categorie} - ${config.WEBSITE_NAME}`;
            options.keywords = ["مجتمع إسلامي", "محتوى ثقافي إسلامي", "تعليم إسلامي", "منتديات إسلامية", "مقالات إسلامية", "تواصل إسلامي", "تعاون إسلامي", "موارد تعليمية إسلامية", "مدونات إسلامية"];
            options.description = getCategorie?.dataValues?.description;
            options.preview = "صورة_المعاينة_للصفحة";
            options.session = request.session;
            options.getCategorie = getCategorie?.dataValues;
            const pugPath = path.join(__dirname, './views/forum/categories.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        } else {
            options.title = `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`;
            options.keywords = ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"];
            options.description = "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.";
            options.preview = "صورة_المعاينة_للصفحة";
            options.status - 404;
            options.session = request.session;
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
        }

    });

    app.get('/api/forum', async (request, response) => {
        const queryCategoryId = request.query.category_id;
        const category_id = convertToNumber(queryCategoryId);

        if (category_id) {

            const existingCategory = await Categories.findOne({
                where: { category_id },
            });

            if (existingCategory?.dataValues?.category_id === category_id) {
                const TopicsJson = await database.getTopicsByCategoryId(category_id);
                response.json({
                    ...existingCategory?.dataValues,
                    topics: TopicsJson
                });
            }

            else {
                response.json({
                    message: "لم يتم العثور على الفئة"
                });
            }
        }

        else {
            response.json({
                message: "لم تقم بإدخال معرف الفئة: category_id"
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