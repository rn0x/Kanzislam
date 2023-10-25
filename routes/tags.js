import error from "./error.js";

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
                const pugPath = path.join(__dirname, './views/forum/tags.pug');
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }

            else {
                await error({ config, request, path, response, __dirname, pug, jsStringify });
            }

        }

        else {
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }
    });

}