export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, database, getElapsedTime }) => {
  
    const { Tags, Topics } = model;

    app.get('/tags/:tag', async (request, response) => {
 
        const tag = request.params?.tag;
        const AllTags = await database.getAllTags("get").catch((error) => {
            console.log(error);
        });

        const findTag = AllTags.uniqueTags.find((e) => e === tag);

        if (findTag) {
            const SearchTag = await database.getAllTags("search", findTag).catch((error) => {
                console.log(error);
            });

            // response.json(SearchTag);

            if (SearchTag.uniqueTags?.length !== 0 && SearchTag?.isFindKeyword) {

                const topics = SearchTag.tagsWithRelatedTopics?.[findTag]
                for (const item of topics) {
                    console.log(item);
                }

                const options = {
                    website_name: config.WEBSITE_NAME,
                    title: `المواضيع المرتبطة بـ [ ${tag} ] - ${config.WEBSITE_NAME}`,
                    keywords: [`${tag}`, `مواضيع مرتبطة بـ ${tag}`, `فهرس ${tag}`],
                    description: `هذه الصفحة تحتوي على مجموعة من المواضيع المرتبطة بالتاق [${tag}]. يتم تقديم هذه المواضيع بالتفصيل مع عناوين المواضيع والكلمات الدليلية المرتبطة بها. يمكنك استكشاف هذه المواضيع للعثور على المزيد من المعلومات حول موضوعاتك المفضلة.`,
                    preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`المواضيع المرتبطة بـ [ ${tag} ]`)}&description=${encodeURIComponent(`هذه الصفحة تحتوي على مجموعة من المواضيع المرتبطة بالتاق [${tag}]. يتم تقديم هذه المواضيع بالتفصيل مع عناوين المواضيع والكلمات الدليلية المرتبطة بها. يمكنك استكشاف هذه المواضيع للعثور على المزيد من المعلومات حول موضوعاتك المفضلة.`)}`,
                    session: request.session,
                    tag: tag,
                    topics: topics,
                    isFindKeyword: SearchTag?.isFindKeyword,
                    getElapsedTime: getElapsedTime,
                };
                const pugPath = path.join(__dirname, './views/tags.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }

            else {
                const options = {
                    website_name: config.WEBSITE_NAME,
                    title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                    keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                    description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                    preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`)}&description=${encodeURIComponent("صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.")}`,
                    status: 404,
                    session: request.session
                };
                const pugPath = path.join(__dirname, './views/Error.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.status(404).send(render);
            }

        }

        else {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`)}&description=${encodeURIComponent("صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.")}`,
                status: 404,
                session: request.session
            };
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
        }
    });

}