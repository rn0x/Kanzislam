import express from 'express';
import fileUpload from 'express-fileupload';
import compression from 'compression';
import helmet from "helmet";
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import pug from 'pug';
import jsStringify from 'js-stringify';
import createUploadsFolder from './utils/createUploadsFolder.js';
import analyzeText from './utils/analyzeText.js';
import filterSpan from './public/js/modules/filterSpan.js';
import sitemap from './utils/sitemap.js';
import preview from './routes/preview.js';
import upload from './routes/upload.js';
import home from './routes/home.js';
import quran from './routes/pages/quran.js';
import adhkar from './routes/pages/adhkar.js';
import hisnmuslim from './routes/pages/hisnmuslim.js';
import prayer from './routes/pages/prayer.js';
import not_found from './routes/not_found.js';
import radio from './routes/pages/radio.js';
import tafsir from './routes/pages/tafsir.js';
import history from './routes/pages/history.js';
import fatwas from './routes/pages/fatwas.js';
import sabha from './routes/pages/sabha.js';

// Get the current working directory
const __dirname = path.resolve();
const configPath = path.join(__dirname, 'config.json');
const config = await fs.readJson(configPath).catch(() => ({}));
const app = express();
const port = config.PORT || 3000;
const param = {
    app,
    pug,
    path,
    fs,
    config,
    __dirname: path.resolve(),
    jsStringify,
    filterSpan,
    analyzeText,
};

await createUploadsFolder(param); // إنشاء مجلد uploads والمجلدات الفرعية

// استخدام compress لضغط جميع الاستجابات
app.use(compression({
    level: 6, // مستوى الضغط (1-9)
    threshold: 1000, // حجم الاستجابة المطلوبة لتنفيذ الضغط (بايت)
    memLevel: 8, // مستوى الذاكرة المستخدمة للضغط (1-9)
}));

// تساعد الخوذة في تأمين تطبيقات Express عن طريق تعيين رؤوس استجابة HTTP.
app.use(
    helmet({
        contentSecurityPolicy: {
            // يحدد السماح بالأنشطة المسموح بها على الصفحة ويقلل من الهجمات المحتملة.
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "*"],
                fontSrc: ["'self'", "*"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'", "*"],
                frameSrc: ["'self'", "https://www.youtube.com"],
                childSrc: ["'self'"],
                connectSrc: ["'self'", "*"],
                workerSrc: ["'self'", "blob:"],
                manifestSrc: ["'self'"],
            },
        },
        crossOriginOpenerPolicy: true, // يساعد في عزل العمليات المتعلقة بالصفحة.
        crossOriginResourcePolicy: false, // يمنع الآخرين من تحميل الموارد الخاصة بك عبر الأصل.
        originAgentCluster: true, // يغير عزل العمليات ليكون مستندًا على الأصل.
        referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // يتحكم في رأس المرجعية (Referer header).
        strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true }, // يخبر المتصفحات بتفضيل استخدام HTTPS.
        xContentTypeOptions: true, // يتجنب التحقق من نوع MIME (MIME sniffing).
        xDnsPrefetchControl: { allow: true }, // يتحكم في مسبقة تحميل DNS.
        xDownloadOptions: true, // يجبر التنزيلات على الحفظ (فقط في Internet Explorer).
        xFrameOptions: { action: "sameorigin" }, // رأس قديم يقلل من هجمات الـ clickjacking.
        xPermittedCrossDomainPolicies: { permittedPolicies: "none" }, // يتحكم في سلوك العمل عبر النطاق العرضي لمنتجات Adobe مثل Acrobat.
        xXssProtection: false, // رأس قديم يحاول التقليل من هجمات XSS، ولكن يجعل الأمور أسوأ، لذلك يتم تعطيله بواسطة Helmet.
    })
);

app.disable('x-powered-by');  // معلومات حول خادم الويب. تم تعطيله لأنه يمكن استخدامه في هجمات بسيطة.
// Enable file upload middleware
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
await preview(param);
await upload(param);
await home(param);
await quran(param);
await adhkar(param);
await hisnmuslim(param);
await prayer(param);
await radio(param);
await tafsir(param);
await history(param);
await fatwas(param);
await sabha(param);
await not_found(param);

// يقوم بإنشاء ملف sitemap وفهرس sitemap بناءً على الصفحات المعطاة.
await sitemap();

app.use(async (request, response, next) => {
    response.redirect('/not-found');
});

app.use(function (err, request, response, next) {
    // Handle the error
    console.error(err);
    const options = {
        website_name: config.WEBSITE_NAME,
        title: `خطأ في الخادم الداخلي 505 - ${config.WEBSITE_NAME}`,
        keywords: ["صفحة الخطأ 505", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "505", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
        description: "صفحة الخطأ 505 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
        preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("خطأ في الخادم الداخلي 505 ")}&description=${encodeURIComponent("صفحة الخطأ 505 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.")}`,
        errorMassage: err,
        status: 500,
    };
    const pugPath = path.join(__dirname, './views/Error.pug');
    const render = pug.renderFile(pugPath, { options, jsStringify });
    response.status(500).send(render);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});