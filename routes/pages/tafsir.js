export default async ({ app, pug, path, fs, config, __dirname, jsStringify, filterSpan }) => {

    const tafsir_name_path = path.join(__dirname, 'public/json/tafsir/tafsir_name.json');
    const tafsir_name_json = await fs.readJson(tafsir_name_path).catch(() => ({}));
    const quranPath = path.join(__dirname, 'public/json/quran_info.json');
    const ayatPath = path.join(__dirname, 'public/json/ayat.json');
    const quranJson = await fs.readJson(quranPath).catch(() => ({}));
    const ayatJson = await fs.readJson(ayatPath).catch(() => ({}));

    app.get('/tafsir-quran', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            CONTACT: config.CONTACT,
            title: `تفاسير القرآن الكريم - الطبري, ابن كثير، السعدي، القرطبي، البغوي، ابن عاشور والمزيد - ${config.WEBSITE_NAME}`,
            keywords: ["تفاسير القرآن", "تفسير", "تفسير القران", "الطبري", "ابن كثير", "السعدي", "القرطبي", "البغوي", "ابن عاشور", "الأعلام القرآنية", "تفسير القرآن الكريم", "تفاسير إسلامية", "تفسير آيات القرآن", "تفسير القرآن الكريم باللغة العربية", "علماء الإسلام", "فهم القرآن", "تفسير القرآن باللغة العربية", "معاني القرآن", "تفاسير قرآنية", "تفسير سور القرآن", "مفهوم القرآن", "تفاسير مشهورة"],
            description: "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("تفاسير القرآن الكريم - الطبري, ابن كثير، السعدي، القرطبي، البغوي، ابن عاشور والمزيد")}&description=${encodeURIComponent("استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.")}`,
            tafsir_name: tafsir_name_json
        };
        const pugPath = path.join(__dirname, './views/pages/tafsir.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.get('/tafsir-quran/:tfs', async (request, response) => {

        const { tfs } = request.params;
        const tafsir = tafsir_name_json.find((e) => e?.name_english === tfs);

        if (tafsir) {

            const options = {
                website_name: config.WEBSITE_NAME,
                CONTACT: config.CONTACT,
                title: `تفاسير القرآن الكريم - الطبري, ابن كثير، السعدي، القرطبي، البغوي، ابن عاشور والمزيد - ${config.WEBSITE_NAME}`,
                keywords: ["تفاسير القرآن", "تفسير", "تفسير القران", "الطبري", "ابن كثير", "السعدي", "القرطبي", "البغوي", "ابن عاشور", "الأعلام القرآنية", "تفسير القرآن الكريم", "تفاسير إسلامية", "تفسير آيات القرآن", "تفسير القرآن الكريم باللغة العربية", "علماء الإسلام", "فهم القرآن", "تفسير القرآن باللغة العربية", "معاني القرآن", "تفاسير قرآنية", "تفسير سور القرآن", "مفهوم القرآن", "تفاسير مشهورة"],
                description: "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("تفاسير القرآن الكريم - الطبري, ابن كثير، السعدي، القرطبي، البغوي، ابن عاشور والمزيد")}&description=${encodeURIComponent("استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.")}`,
                session: request.session,
                tafsir: tafsir
            };
            const pugPath = path.join(__dirname, './views/pages/tafsir.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);

        } else {
            response.redirect('/not-found');
        }
    });

    app.get('/tafsir-quran/:tfs/:surah/', async (request, response) => {

        const { tfs, surah } = request.params;
        const tafsir = tafsir_name_json.find((e) => e?.name_english === tfs);
        const quranSurah = quranJson.find((e) => e?.number === Number(surah));

        if (tafsir && quranSurah) {

            const options = {
                website_name: config.WEBSITE_NAME,
                CONTACT: config.CONTACT,
                title: `تفسير القرآن الكريم (${tafsir?.name}) : سورة ${quranSurah?.name} - ${config.WEBSITE_NAME}`,
                keywords: ["تفاسير القرآن", "تفسير", "تفسير القران", "الطبري", "ابن كثير", "السعدي", "القرطبي", "البغوي", "ابن عاشور", "الأعلام القرآنية", "تفسير القرآن الكريم", "تفاسير إسلامية", "تفسير آيات القرآن", "تفسير القرآن الكريم باللغة العربية", "علماء الإسلام", "فهم القرآن", "تفسير القرآن باللغة العربية", "معاني القرآن", "تفاسير قرآنية", "تفسير سور القرآن", "مفهوم القرآن", "تفاسير مشهورة"],
                description: "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`تفسير القرآن الكريم (${tafsir?.name}) : سورة ${quranSurah?.name}`)}&description=${encodeURIComponent("استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.")}`,
                session: request.session,
                tafsir: tafsir,
                surah: quranSurah
            };
            const pugPath = path.join(__dirname, './views/pages/tafsir_surah.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);

        } else {
            response.redirect('/not-found');
        }
    });

    app.get('/tafsir-quran/:tfs/:surah/:ayah', async (request, response) => {

        const { tfs, surah, ayah } = request.params;
        const tafsir = tafsir_name_json.find((e) => e?.name_english === tfs);
        const quranSurah = quranJson.find((e) => e?.number === Number(surah));
        const Surah = ayatJson.find((e) => e?.id === Number(surah));
        const quranAyah = Surah.ayat.find((e) => e?.id === Number(ayah));

        if (tafsir && quranSurah && quranAyah) {

            const tafsirPath = path.join(__dirname, `public/json/tafsir/${tafsir?.name_english}.json`);
            const tafsirJson = await fs.readJson(tafsirPath).catch(() => ({}));
            const tafsirContent = tafsirJson.tafsir.find((e) => e?.surah === Number(surah) && e?.ayah === Number(ayah));

            const options = {
                website_name: config.WEBSITE_NAME,
                CONTACT: config.CONTACT,
                title: `تفسير القرآن الكريم (${tafsir?.name}) : سورة ${quranSurah?.name} آية رقم ${ayah}- ${config.WEBSITE_NAME}`,
                keywords: ["تفاسير القرآن", "تفسير", "تفسير القران", "الطبري", "ابن كثير", "السعدي", "القرطبي", "البغوي", "ابن عاشور", "الأعلام القرآنية", "تفسير القرآن الكريم", "تفاسير إسلامية", "تفسير آيات القرآن", "تفسير القرآن الكريم باللغة العربية", "علماء الإسلام", "فهم القرآن", "تفسير القرآن باللغة العربية", "معاني القرآن", "تفاسير قرآنية", "تفسير سور القرآن", "مفهوم القرآن", "تفاسير مشهورة"],
                description: "استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.",
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`تفسير القرآن الكريم (${tafsir?.name}) : سورة ${quranSurah?.name} آية رقم ${ayah}- ${config.WEBSITE_NAME}`)}&description=${encodeURIComponent("استمتع بفهم أعمق لآيات القرآن الكريم من خلال تفاسير متنوعة من قبل علماء الإسلام مثل: ابن كثير والسعدي والقرطبي والطبري. والمزيد.")}`,
                session: request.session,
                tafsir: tafsir,
                surah: quranSurah,
                ayah: quranAyah,
                tafsirContent: tafsirContent?.text,
                
                filterSpan: filterSpan
            };
            const pugPath = path.join(__dirname, './views/pages/tafsir_ayah.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);

        } else {
            response.redirect('/not-found');
        }
    });


    app.get('/tafsir-data', async (request, response) => {

        let { tafsir, surah, ayah } = request.query;
        surah = Number(surah);
        ayah = Number(ayah);
        const tafsirPath = path.join(__dirname, `public/json/tafsir/${tafsir}.json`);
        const existsSync = fs.existsSync(tafsirPath);

        if (existsSync && surah && ayah) {
            const tafsirJson = await fs.readJson(tafsirPath).catch(() => ({}));
            const tafsir = tafsirJson.tafsir.find((e) => e.surah === surah && e.ayah === ayah);
            response.json(tafsir);
        }
        else {
            response.json({
                message: `قم بإدخال إسم التفسير + السورة + الآية { tafsir, surah, ayah }\nمثال: ${config?.WEBSITE_DOMAIN}/tafsir-data?tafsir=tanweer&surah=1&ayah=5`
            })
        }
    });
}