export default (param) => {

    const { app, pug, path, fs, config, __dirname, jsStringify, filterSpan } = param;

    app.get('/quran', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session
        };
        let pugPath = path.join(__dirname, './views/quran.pug');
        let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
        response.send(render);
    });

    app.get('/quran/:pathname', async (request, response) => {

        let pathname = request.params.pathname;
        let nameSurah = pathname?.split("سورة")?.join("")?.split("_")?.join(" ")?.trim();
        let quranPath = path.join(__dirname, 'public/json/quran.json');
        let mp3quranPath = path.join(__dirname, 'public/json/mp3quran.json');
        let quranJson = await fs.readJson(quranPath).catch(() => ({}));
        let mp3quranJson = await fs.readJson(mp3quranPath).catch(() => ({}));
        let currentSurahIndex = quranJson.findIndex(e => e.name === nameSurah);
        let currentSurah = quranJson[currentSurahIndex]; // السورة الحالية
        let previousSurah = currentSurahIndex === 0 ? quranJson[quranJson.length - 1] : quranJson[currentSurahIndex - 1]; // السورة السابقة
        let nextSurah = currentSurahIndex === quranJson.length - 1 ? quranJson[0] : quranJson[currentSurahIndex + 1]; // السورة التالية

        if (currentSurah.name) {

            let mp3quranFind = mp3quranJson.map(reader => {
                let surah = reader.audio.find(item => item.name === nameSurah);
                return {
                    reader: reader.name,
                    rewaya: reader.rewaya,
                    link: surah?.link
                };
            });

            let options = {
                website_name: config.WEBSITE_NAME,
                title: `سورة ${currentSurah.name} قراءة وأستماع - ${config.WEBSITE_NAME}`,
                keywords: ["word1", "word2", "word3"],
                description: "وصف_الصفحة",
                preview: "صورة_المعاينة_للصفحة",
                session: request.session,
                pathname: request.params.pathname,
                bisamla: nameSurah !== 'التوبة' ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ',
                surah: filterSpan(currentSurah.surah.replace(/\(/g, '﴿').replace(/\)/g, '﴾')),
                currentSurah: currentSurah,
                previousSurah: previousSurah,
                nextSurah: nextSurah,
                mp3quranFind: mp3quranFind
            };
            let pugPath = path.join(__dirname, './views/quran_pathname.pug');
            let render = pug.renderFile(pugPath, { options: options, jsStringify: jsStringify });
            response.send(render);
        }

        else {
            response.status(404).send('الصفحة غير موجودة.');
        }

    });
}