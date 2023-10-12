export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    const options = {
        website_name: config.WEBSITE_NAME,
        title: `فهرس حصن المسلم من أذكار الكتاب والسنة - ${config.WEBSITE_NAME}`,
        keywords: ["حصن المسلم", "الأذكار اليومية", "الأذكار الإسلامية", "الدين الإسلامي", "أذكار الكتاب والسنة", "أذكار", "اذكاري", "اذكار  يومية", "حصن نفسك", "أذكار متنوعة", "أذكار المسلم", "أذكار صوتية"],
        description: "“حصن المسلم”: مصدرك الشامل لأذكار الكتاب والسنة، يقدم مجموعة من الأذكار التي قالها النبي محمد ﷺ في مختلف مواضع الحياة اليومية.",
        preview: "صورة_المعاينة_للصفحة"
    };
    const pugPath = path.join(__dirname, './views/hisnmuslim.pug');
    const hisnmuslimPath = path.join(__dirname, 'public/json/hisnmuslim.json');
    const hisnmuslimJson = await fs.readJson(hisnmuslimPath).catch(() => ({}));

    app.get('/hisnmuslim', async (request, response) => {

        options.titleBox = "فهرس حصن المسلم";
        options.isIndex = true;
        options.isAdhkarHisnMuslim = false;
        options.isHisText = false;
        options.session = request.session;
        let render = pug.renderFile(pugPath, { options, jsStringify });
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
            options.keywords.push(hisnmuslimFound?.category);
            options.isIndex = false;
            options.isAdhkarHisnMuslim = true;
            options.isHisText = false;
            options.hisnmuslimFound = hisnmuslimFound;
            options.session = request.session;
            let render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }
        else {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                preview: "صورة_المعاينة_للصفحة",
                status: 404
            };
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
        }
    });

    app.get('/hisnmuslims/:pathname', async (request, response) => {
        const { pathname } = request.params;
        const title = pathname?.split("_").join(" ");
        const isTitleFind = findObjectByText(hisnmuslimJson, pathname);
        if (isTitleFind) {
            options.title = `${title} - ${config.WEBSITE_NAME}`
            options.description = `“حصن المسلم” : ${isTitleFind?.object?.text ? isTitleFind?.text : title}.`
            options.titleBox = `${isTitleFind?.category} - رقم الذكر: ${isTitleFind?.object?.id}`;
            options.isIndex = false;
            options.isAdhkarHisnMuslim = false;
            options.isHisText = true;
            options.ObjectHis = isTitleFind?.object;
            options.category = isTitleFind?.category;
            options.session = request.session;
            let render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }

        else {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
                keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
                description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
                preview: "صورة_المعاينة_للصفحة",
                status: 404
            };
            const pugPath = path.join(__dirname, './views/Error.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(404).send(render);
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