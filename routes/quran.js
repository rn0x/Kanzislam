export default async ({ app, pug, path, fs, config, __dirname, jsStringify, filterSpan }) => {
    app.get('/quran', async (request, response) => {
        const quranPath = path.join(__dirname, 'public/json/quran.json');
        const quranJson = await fs.readJson(quranPath).catch(() => ({}));
        const options = {
            website_name: config.WEBSITE_NAME,
            title: `فهرس سور القرآن الكريم - قراءة واستماع - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "فهرس لسور القرآن الكريم للقراءة والاستماع بصوت أكثر من 157 قارئ",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session,
            quranJson
        };
        const pugPath = path.join(__dirname, './views/quran.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/quran/:pathname', async (request, response) => {
        const { pathname } = request.params;
        const nameSurah = pathname?.split("سورة")?.join("")?.split("_")?.join(" ")?.trim();
        const quranPath = path.join(__dirname, 'public/json/quran.json');
        const mp3quranPath = path.join(__dirname, 'public/json/mp3quran.json');
        const quranJson = await fs.readJson(quranPath).catch(() => ({}));
        const mp3quranJson = await fs.readJson(mp3quranPath).catch(() => ({}));
        const currentSurahIndex = quranJson.findIndex(e => e.name === nameSurah);
        const currentSurah = quranJson[currentSurahIndex];
        const previousSurah = currentSurahIndex === 0 ? quranJson[quranJson.length - 1] : quranJson[currentSurahIndex - 1];
        const nextSurah = currentSurahIndex === quranJson.length - 1 ? quranJson[0] : quranJson[currentSurahIndex + 1];

        if (currentSurah?.name) {
            const mp3quranFind = mp3quranJson.map(reader => {
                const surah = reader.audio.find(item => item.name === nameSurah);
                return {
                    reader: reader.name,
                    rewaya: reader.rewaya,
                    link: surah?.link
                };
            });

            const options = {
                website_name: config.WEBSITE_NAME,
                title: `سورة ${currentSurah.name} قراءة وأستماع وتحميل mp3 - ${config.WEBSITE_NAME}`,
                keywords: ["word1", "word2", "word3"],
                description: `سورة ${currentSurah.name} -  للقراءة والاستماع بصوت أكثر من 157 قارئ, ومعلومات حول السورة اين نزلت وكم عددة كلماتها وحروفها وآيتها وإسمها باللغة الإنجليزية`,
                preview: "صورة_المعاينة_للصفحة",
                session: request.session,
                pathname,
                bisamla: nameSurah !== 'التوبة' ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ',
                surah: filterSpan(currentSurah.surah.replace(/\(/g, '﴿').replace(/\)/g, '﴾')),
                currentSurah,
                previousSurah,
                nextSurah,
                mp3quranFind
            };
            const pugPath = path.join(__dirname, './views/quran_pathname.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        } else {
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
};  