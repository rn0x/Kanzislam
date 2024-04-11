export default async ({ app, pug, path, fs, config, __dirname, jsStringify, filterSpan }) => {
    const quranPath = path.join(__dirname, 'public/json/quran_info.json');
    const surahPath = path.join(__dirname, 'public/json/surah.json');
    const mp3quranPath = path.join(__dirname, 'public/json/mp3quran.json');
    let quranJson;
    let mp3quranJson;
    let surahJson;

    // Read Quran and mp3quran JSON files once and cache the data
    fs.readJson(surahPath)
        .then(json => {
            surahJson = json;
        })
        .catch(() => {
            surahJson = [];
        });

    fs.readJson(quranPath)
        .then(json => {
            quranJson = json;
        })
        .catch(() => {
            quranJson = [];
        });

    fs.readJson(mp3quranPath)
        .then(json => {
            mp3quranJson = json;
        })
        .catch(() => {
            mp3quranJson = [];
        });

    app.get('/quran', (request, response) => {
        const options = {
            website_name: config.WEBSITE_NAME,
            CONTACT: config.CONTACT,
            title: `فهرس سور القرآن الكريم - قراءة واستماع - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "فهرس لسور القرآن الكريم للقراءة والاستماع بصوت أكثر من 157 قارئ",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("فهرس سور القرآن الكريم - قراءة واستماع")}&description=${encodeURIComponent("فهرس لسور القرآن الكريم للقراءة والاستماع بصوت أكثر من 157 قارئ")}`,
            quranJson
        };
        const pugPath = path.join(__dirname, './views/pages/quran.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/quran/:pathname', async (request, response) => {
        const { pathname } = request.params;
        const nameSurah = pathname?.split("سورة")?.join("")?.split("_")?.join(" ")?.trim();
        const currentSurah = quranJson.find(e => e.name === nameSurah);
        if (currentSurah?.name) {
            const options = {
                website_name: config.WEBSITE_NAME,
                CONTACT: config.CONTACT,
                title: `سورة ${currentSurah.name} قراءة وأستماع وتحميل mp3 - ${config.WEBSITE_NAME}`,
                keywords: ["word1", "word2", "word3"],
                description: `سورة ${currentSurah.name} -  للقراءة والاستماع بصوت أكثر من 157 قارئ, ومعلومات حول السورة اين نزلت وكم عددة كلماتها وحروفها وآيتها وإسمها باللغة الإنجليزية`,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`سورة ${currentSurah.name} قراءة وأستماع وتحميل mp3`)}&description=${encodeURIComponent(`سورة ${currentSurah.name} -  للقراءة والاستماع بصوت أكثر من 157 قارئ, ومعلومات حول السورة اين نزلت وكم عددة كلماتها وحروفها وآيتها وإسمها باللغة الإنجليزية`)}`,
                currentSurah: currentSurah,
                nameSurah: nameSurah
            };
            const pugPath = path.join(__dirname, './views/pages/quran_pathname.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        } else {
            response.redirect('/not-found');
        }
    });


    app.get('/data-quran', (request, response) => {
        const { nameSurah } = request.query;
        const currentQuranIndex = quranJson.findIndex(e => e.name === nameSurah);
        const currentSurahIndex = surahJson.findIndex(e => e.name === nameSurah);
        const currentSurah = { ...quranJson[currentQuranIndex], ...surahJson[currentSurahIndex] };
        
        if (currentSurah?.name) {
            const previousSurah = currentQuranIndex === 0 ? { ...quranJson[quranJson.length - 1], ...surahJson[surahJson.length - 1] } : { ...quranJson[currentQuranIndex - 1], ...surahJson[currentSurahIndex.length - 1] };
            const nextSurah = currentQuranIndex === quranJson.length - 1 ? { ...quranJson[0], ...surahJson[0] } : { ...quranJson[currentQuranIndex + 1], ...surahJson[currentSurah + 1] };
            const mp3quranFind = mp3quranJson.map(reader => {
                const surah = reader.audio.find(item => item.name === nameSurah);
                return {
                    reader: reader.name,
                    rewaya: reader.rewaya,
                    link: surah?.link
                };
            });

            response.json({
                nameSurah,
                bisamla: nameSurah !== 'التوبة' ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ',
                surah: filterSpan(currentSurah.surah.replace(/\(/g, '﴿').replace(/\)/g, '﴾')),
                currentSurah,
                previousSurah,
                nextSurah,
                mp3quranFind
            })

        }

        else {
            response.json(quranJson)
        }
    });
};  