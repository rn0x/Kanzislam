import error from "../error.js";

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, database, convertToNumber }) => {

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
        Audios
    } = model;

    app.get('/forum', async (request, response) => {
        const options = {};
        options.website_name = config.WEBSITE_NAME;
        options.title = `مجتمع ${config.WEBSITE_NAME}: منصة تفاعلية للمعرفة والتواصل الإسلامي`;
        options.keywords = ["مجتمع إسلامي", "محتوى ثقافي إسلامي", "تعليم إسلامي", "منتديات إسلامية", "مقالات إسلامية", "تواصل إسلامي", "تعاون إسلامي", "موارد تعليمية إسلامية", "مدونات إسلامية"];
        options.description = `مجتمع ${config.WEBSITE_NAME} هي منصة مجتمعية عبر الإنترنت تهدف إلى توفير محتوى ثقافي وتعليمي إسلامي شامل ومتنوع. يوفر المجتمع مساحة للمشاركة والتفاعل بين المستخدمين من خلال المنتديات والمدونات والمقالات والموارد التعليمية. يهدف المجتمع إلى تعزيز الفهم الصحيح للإسلام وتعزيز التواصل والتعاون بين أفراد المجتمع الإسلامي.`;
        options.preview = `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`مجتمع ${config.WEBSITE_NAME}: منصة تفاعلية للمعرفة والتواصل الإسلامي`)}&description=${encodeURIComponent(`مجتمع ${config.WEBSITE_NAME} هي منصة مجتمعية عبر الإنترنت تهدف إلى توفير محتوى ثقافي وتعليمي إسلامي شامل ومتنوع. يوفر المجتمع مساحة للمشاركة والتفاعل بين المستخدمين من خلال المنتديات والمدونات والمقالات والموارد التعليمية. يهدف المجتمع إلى تعزيز الفهم الصحيح للإسلام وتعزيز التواصل والتعاون بين أفراد المجتمع الإسلامي.`)}`;
        options.session = request.session;
        const pugPath = path.join(__dirname, './views/forum/index.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/forum/:categorie', async (request, response) => {
        const categorie = convertToNumber(request.params?.categorie?.trim());
        if (categorie) {
            const getCategorie = await Categories.findOne({
                where: { category_id: categorie },
            }).catch((error) => {
                console.log(error);
            });

            if (getCategorie?.dataValues) {
                const options = {};
                options.website_name = config.WEBSITE_NAME;
                options.title = `${getCategorie.title} - ${config.WEBSITE_NAME}`;
                options.keywords = ["مجتمع إسلامي", "محتوى ثقافي إسلامي", "تعليم إسلامي", "منتديات إسلامية", "مقالات إسلامية", "تواصل إسلامي", "تعاون إسلامي", "موارد تعليمية إسلامية", "مدونات إسلامية"];
                options.description = getCategorie?.dataValues?.description;
                options.preview = `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(getCategorie.title)}&description=${encodeURIComponent(getCategorie?.dataValues?.description)}`;
                options.session = request.session;
                options.getCategorie = getCategorie?.dataValues;
                const pugPath = path.join(__dirname, './views/forum/categories.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            } else {
                await error({ config, request, path, response, __dirname, pug, jsStringify });
            }
        } else {
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }

    });

    app.get('/topic-category', async (request, response) => {
        const queryCategoryId = request.query.category_id;
        const category_id = convertToNumber(queryCategoryId);

        if (category_id) {

            const existingCategory = await Categories.findOne({
                where: { category_id },
            }).catch((error) => {
                console.log(error);
            });

            if (existingCategory?.dataValues?.category_id === category_id) {
                const TopicsJson = await database.getTopicsByCategoryId(category_id);
                response.json({
                    ...TopicsJson
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

    app.get('/categories', async (request, response) => {

        const getAllCategories = await Categories.findAll().catch((error) => {
            console.log(error);
        });
        const getAllTopics = await Topics.findAll().catch((error) => {
            console.log(error);
        });
        const getAllComments = await Comments.findAll().catch((error) => {
            console.log(error);
        });

        const AllCategories = getAllCategories.map(category => {
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

        response.json({
            getAllCategories: AllCategories
        })

    });
}