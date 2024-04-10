export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    const options = {
        website_name: config.WEBSITE_NAME,
    };
    const pugPath = path.join(__dirname, './views/pages/hisnmuslim.pug');
    const hisnmuslimPath = path.join(__dirname, 'public/json/hisnmuslim.json');
    const hisnmuslimJson = await fs.readJson(hisnmuslimPath).catch(() => ({}));

    app.get('/hisnmuslim', async (request, response) => {

        options.title = `فهرس حصن المسلم من أذكار الكتاب والسنة - ${config.WEBSITE_NAME}`;
        options.description = "“حصن المسلم”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.";
        options.keywords = ["حصن المسلم", "الأذكار اليومية", "الأذكار الإسلامية", "الدين الإسلامي", "أذكار الكتاب والسنة", "أذكار", "اذكاري", "اذكار  يومية", "حصن نفسك", "أذكار متنوعة", "أذكار المسلم", "أذكار صوتية"];
        options.titleBox = "فهرس حصن المسلم";
        options.isIndex = true;
        options.isAdhkarHisnMuslim = false;
        options.isHisText = false;
        options.preview= `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`حصن المسلم من أذكار الكتاب والسنة`)}&description=${encodeURIComponent("“حصن المسلم”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.")}`
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/hisnmuslim/:pathname', async (request, response) => {
        const { pathname } = request.params;
        const category = pathname?.split("_")?.join(" ");
        const hisnmuslimFound = hisnmuslimJson.find(item => item?.category === category);

        if (hisnmuslimFound) {
            options.title = `${hisnmuslimFound?.category} - ${config.WEBSITE_NAME}`
            options.description = `“حصن المسلم - ${hisnmuslimFound?.category}”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.`
            options.titleBox = hisnmuslimFound?.category;
            options.keywords = [hisnmuslimFound?.category, "حصن المسلم", "الأذكار اليومية", "الأذكار الإسلامية", "الدين الإسلامي", "أذكار الكتاب والسنة", "أذكار", "اذكاري", "اذكار  يومية", "حصن نفسك", "أذكار متنوعة", "أذكار المسلم", "أذكار صوتية"];
            options.isIndex = false;
            options.isAdhkarHisnMuslim = true;
            options.isHisText = false;
            options.hisnmuslimFound = hisnmuslimFound;
            options.preview= `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`حصن المسلم من أذكار الكتاب والسنة - ${hisnmuslimFound?.category}`)}&description=${encodeURIComponent("“حصن المسلم”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.")}`
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            response.redirect('/not-found');
        }
    });

    app.get('/hisnmuslims/:pathname', async (request, response) => {
        const { pathname } = request.params;
        const title = pathname?.split("_").join(" ");
        const isTitleFind = findObjectByText(hisnmuslimJson, pathname);
        if (isTitleFind) {
            options.title = `${title} - ${config.WEBSITE_NAME}`
            options.description = `“حصن المسلم” : ${isTitleFind?.object?.text ? isTitleFind?.text : title}.`
            options.keywords = ["حصن المسلم", "الأذكار اليومية", "الأذكار الإسلامية", "الدين الإسلامي", "أذكار الكتاب والسنة", "أذكار", "اذكاري", "اذكار  يومية", "حصن نفسك", "أذكار متنوعة", "أذكار المسلم", "أذكار صوتية"];
            options.titleBox = `${isTitleFind?.category} - ${isTitleFind?.object?.id}`;
            options.isIndex = false;
            options.isAdhkarHisnMuslim = false;
            options.isHisText = true;
            options.ObjectHis = isTitleFind?.object;
            options.category = isTitleFind?.category;
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }

        else {
            response.redirect('/not-found');
        }
    });

    function findObjectByText(data, text) {
        for (let i = 0; i < data.length; i++) {
            const obj = data[i];
            if (obj.array && obj.array.length > 0) {
                for (let j = 0; j < obj.array.length; j++) {
                    if (removeArabicDiacritics(obj.array[j].text, 15) === text) {
                        return {
                            object: obj.array[j],
                            category: obj.category
                        };
                    }
                }
            }
        }
        return null;
    }

    function removeArabicDiacritics(sentence, itemWords) {
        const diacriticsMap = {
            'آ': 'ا',
            'أ': 'ا',
            'إ': 'ا',
            'اً': 'ا',
            'ٱ': 'ا',
            'ٲ': 'ا',
            'ٳ': 'ا',
            'ٵ': 'ا',
            'ٷ': 'ؤ',
            'ٹ': 'ت',
            // Add more Arabic characters and their replacements as needed
        };
        return sentence?.replace(/[\u064B-\u065F\u0670]/g, '')
            .split(" ")?.slice(0, parseInt(itemWords))?.join(' ')
            .replace(/\)/g, "")
            .replace(/\(/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "")
            .replace(/\﴿/g, "")
            .replace(/\﴾/g, "")
            .replace(/\ /g, "_")
            .replace(/\,/g, "")
            .replace(/\،/g, "")
            .replace(/\:/g, "")
            .replace(/\./g, "")
            .replace(/./g, char => diacriticsMap[char] || char);
    }
}