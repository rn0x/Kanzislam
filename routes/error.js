export default async ({ config, request, path, response, __dirname, pug, jsStringify }) => {
    const options = {
        website_name: config.WEBSITE_NAME,
        title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
        keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
        description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
        preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`)}&description=${encodeURIComponent("صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.")}`,
        status: 404,
        session: request.session
    };
    const pugPath = path.join(__dirname, './views/Error.pug');
    const render = pug.renderFile(pugPath, { options, jsStringify });
    response.status(404).send(render);
}