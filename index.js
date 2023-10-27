import express from 'express';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import compression from 'compression';
import helmet from "helmet";
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import pug from 'pug';
import jsStringify from 'js-stringify';
import EmailSender from './modules/emailSender.js';
import createUploadsFolder from './modules/createUploadsFolder.js';
import generatePassword from './public/js/modules/generatePassword.js';
import checkTextLength from './public/js/modules/checkTextLength.js';
import convertToNumber from './public/js/modules/convertToNumber.js';
import analyzeText from './public/js/modules/analyzeText.js';
import getElapsedTime from './public/js/modules/getElapsedTime.js';
import {
    sequelize,
    removeColumn,
    addColumn,
    modelObject,
    getTopicsByCategoryId,
    getTopicData,
    deleteTopic,
    getAllTags
} from './database/index.js';
import CreateCategories from './modules/CreateCategories.js';
import filterSpan from './public/js/modules/filterSpan.js';
import sitemap from './routes/sitemap.js';
import preview from './routes/preview.js';
import upload from './routes/upload.js';
import home from './routes/home.js';
import login from './routes/login.js';
import reset_password from './routes/reset_password.js';
import update_password from './routes/update_password.js';
import activate from './routes/activate.js';
import register from './routes/register.js';
import logout from './routes/logout.js';
import quran from './routes/quran.js';
import adhkar from './routes/adhkar.js';
import hisnmuslim from './routes/hisnmuslim.js';
import prayer from './routes/prayer.js';
import forum from './routes/forum/index.js';
import error from './routes/error.js';
import radio from './routes/radio.js';

// Get the current working directory
const __dirname = path.resolve();
const configPath = path.join(__dirname, 'config.json');
const config = await fs.readJson(configPath).catch(() => ({}));
const app = express();
const port = config.PORT || 3000;
const emailSender = new EmailSender({
    host: config?.SMTP_HOST,
    port: config?.SMTP_PORT,
    user: config?.SMTP_USER,
    pass: config?.SMTP_PASS,
    displayname: config?.SMTP_DISPLAY_NAME,
});
const param = {
    app,
    pug,
    path,
    fs,
    config,
    __dirname: path.resolve(),
    jsStringify,
    model: modelObject,
    filterSpan,
    emailSender,
    generatePassword,
    checkTextLength,
    database: {
        getTopicsByCategoryId,
        getTopicData,
        deleteTopic,
        getAllTags
    },
    convertToNumber,
    analyzeText,
    getElapsedTime,
};

await createUploadsFolder(param); // إنشاء مجلد uploads والمجلدات الفرعية
await CreateCategories(modelObject.Categories); // إنشاء فئات المجتمع

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
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// routes
await preview(param);
await upload(param);
await home(param);
await login(param);
await register(param);
await logout(param);
await reset_password(param);
await update_password(param);
await activate(param);
await quran(param);
await adhkar(param);
await hisnmuslim(param);
await prayer(param);
await forum(param);
await radio(param);

// يقوم بإنشاء ملف sitemap وفهرس sitemap بناءً على الصفحات المعطاة.
await sitemap(param);

app.use(async (request, response, next) =>{
    await error({ config, request, path, response, __dirname, pug, jsStringify });
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
        session: request.session
    };
    const pugPath = path.join(__dirname, './views/Error.pug');
    const render = pug.renderFile(pugPath, { options, jsStringify });
    response.status(500).send(render);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});