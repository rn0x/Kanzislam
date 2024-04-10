export default async ({ app, pug, path, fs, config, __dirname, jsStringify, filterSpan }) => {

    const adhkarPath = path.join(__dirname, 'public/json/adhkar.json');
    const adhkarJson = await fs.readJson(adhkarPath).catch(() => ({}));
    const adhkarKey = Object.keys(adhkarJson);

    app.get('/adhkar', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `أذكار الصباح والمساء والنوم والصلاة والطعام: دليلك اليومي للتذكير - ${config.WEBSITE_NAME}`,
            keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
            description: "تعتبر صفحة الأذكار مصدرًا رائعًا للتأمل والتفكير. تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في أوقات مختلفة من اليوم.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("أذكار الصباح والمساء والنوم والصلاة والطعام: دليلك اليومي للتذكير")}&description=${encodeURIComponent("تعتبر صفحة الأذكار مصدرًا رائعًا للتأمل والتفكير. تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في أوقات مختلفة من اليوم.")}`,
            adhkarJson,
        };
        const pugPath = path.join(__dirname, './views/pages/adhkar_box.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/adhkar/:pathname', async (request, response) => {
        const pathname = request.params.pathname;
        const isPathAdhkar = adhkarKey.find((e) => adhkarJson[e]?.category?.split(" ")?.join("_") === pathname);

        if (isPathAdhkar) {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `${adhkarJson[isPathAdhkar].category} - ${config.WEBSITE_NAME}`,
                keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
                description: `تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في ${adhkarJson[isPathAdhkar].category}.`,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`${adhkarJson[isPathAdhkar].category}`)}&description=${encodeURIComponent( `تحتوي هذه الصفحة على مجموعة من الأذكار والدعوات التي يمكن قراءتها في ${adhkarJson[isPathAdhkar].category}.`)}`,
                adhkarJson: adhkarJson[isPathAdhkar],
            };
            const pugPath = path.join(__dirname, './views/pages/adhkar.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            response.redirect('/not-found');
        }
    });

    app.get('/adhkars/:pathname', async (request, response) => {
        const pathname = request.params.pathname;
        const AdhkarObject = Object.values(adhkarJson).flatMap(item => item.array.filter(subItem => subItem.title.split(" ").join("_") === pathname).map(subItem => ({ category: item.category, ...subItem })))?.[0];

        if (AdhkarObject) {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `${AdhkarObject.title} - ${config.WEBSITE_NAME}`,
                keywords: ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الطعام", "أذكار الصلاة", "التسابيح", "الدعاء اليومي", "الإسلام", "القرآن", "الحديث", "الإيمان"],
                description: `${AdhkarObject.category} - ${AdhkarObject.description}`,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`${AdhkarObject.title}`)}&description=${encodeURIComponent(`${AdhkarObject.category} - ${AdhkarObject.description}`)}`,
                AdhkarObject,
                filterSpan
            };
            const pugPath = path.join(__dirname, './views/pages/adhkars.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            response.redirect('/not-found');
        }
    });
}