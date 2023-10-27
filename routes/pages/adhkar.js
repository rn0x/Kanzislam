import error from "../error.js";

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, filterSpan }) => {

    let adhkarPath = path.join(__dirname, 'public/json/adhkar.json');
    let adhkarJson = await fs.readJson(adhkarPath).catch(() => ({}));
    let adhkarKey = Object.keys(adhkarJson);

    app.get('/adhkar', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `أذكار الصباح والمساء والنوم والصلاة والطعام: دليلك اليومي للتذكير - ${config.WEBSITE_NAME}`,
            keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
            description: "تعتبر صفحة الأذكار مصدرًا رائعًا للتأمل والتفكير. تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في أوقات مختلفة من اليوم.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("أذكار الصباح والمساء والنوم والصلاة والطعام: دليلك اليومي للتذكير")}&description=${encodeURIComponent("تعتبر صفحة الأذكار مصدرًا رائعًا للتأمل والتفكير. تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في أوقات مختلفة من اليوم.")}`,
            session: request.session,
            adhkarJson,
        };
        let pugPath = path.join(__dirname, './views/pages/adhkar_box.pug');
        let render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/adhkar/:pathname', async (request, response) => {
        let pathname = request.params.pathname;
        let isPathAdhkar = adhkarKey.find((e) => adhkarJson[e]?.category?.split(" ")?.join("_") === pathname);

        if (isPathAdhkar) {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `${adhkarJson[isPathAdhkar].category} - ${config.WEBSITE_NAME}`,
                keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
                description: `تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في ${adhkarJson[isPathAdhkar].category}.`,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`${adhkarJson[isPathAdhkar].category}`)}&description=${encodeURIComponent( `تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في ${adhkarJson[isPathAdhkar].category}.`)}`,
                session: request.session,
                adhkarJson: adhkarJson[isPathAdhkar],
            };
            let pugPath = path.join(__dirname, './views/pages/adhkar.pug');
            let render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }
    });

    app.get('/adhkars/:pathname', async (request, response) => {
        let pathname = request.params.pathname;
        let AdhkarObject = Object.values(adhkarJson).flatMap(item => item.array.filter(subItem => subItem.title.split(" ").join("_") === pathname).map(subItem => ({ category: item.category, ...subItem })))?.[0];

        if (AdhkarObject) {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `${AdhkarObject.title}- ${config.WEBSITE_NAME}`,
                keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
                description: `${AdhkarObject.category} - ${AdhkarObject.description}`,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`${AdhkarObject.title}- ${config.WEBSITE_NAME}`)}&description=${encodeURIComponent(`${AdhkarObject.category} - ${AdhkarObject.description}`)}`,
                session: request.session,
                AdhkarObject,
                filterSpan
            };
            let pugPath = path.join(__dirname, './views/pages/adhkars.pug');
            let render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }
    });
}