export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    app.get('/prayer', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `أوقات الصلاة الدقيقة: تتبع صلواتك اليومية مع التنبيهات الصوتية - ${config.WEBSITE_NAME}`,
            keywords: ["أوقات الصلاة", "الصلاة الإسلامية", "التنبيهات الصوتية للصلاة", "جدول الصلاة", "وقت صلاة الفجر", "وقت صلاة الظهر", "وقت صلاة العصر", "وقت صلاة المغرب", "وقت صلاة العشاء", "التقوى", "الإيمان"],
            description: "تعد هذه الصفحة أداة رائعة لأولئك الذين يرغبون في ضمان أداء صلواتهم الخمس (الفجر، الظهر، العصر، المغرب، العشاء) في الوقت المحدد كل يوم, بناءً على موقع المستخدم. يتم تحديث هذه الأوقات يوميًا لضمان دقتها.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("أوقات الصلاة الدقيقة: تتبع صلواتك اليومية مع التنبيهات الصوتية")}&description=${encodeURIComponent("تعد هذه الصفحة أداة رائعة لأولئك الذين يرغبون في ضمان أداء صلواتهم الخمس (الفجر، الظهر، العصر، المغرب، العشاء) في الوقت المحدد كل يوم, بناءً على موقع المستخدم. يتم تحديث هذه الأوقات يوميًا لضمان دقتها.")}`,
        };
        const pugPath = path.join(__dirname, './views/pages/prayer.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}