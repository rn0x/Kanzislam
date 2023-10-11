import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import pug from 'pug';
import jsStringify from 'js-stringify';
import EmailSender from './modules/emailSender.js';
import generatePassword from './public/js/generatePassword.js';
import checkTextLength from './public/js/checkTextLength.js';
import {
    sequelize,
    User,
    Post,
    removeColumn,
    addColumn,
} from './modules/database.js';
import filterSpan from './public/js/filterSpan.js';
import home from './routes/home.js';
import login from './routes/login.js';
import activate from './routes/activate.js';
import register from './routes/register.js';
import logout from './routes/logout.js';
import quran from './routes/quran.js';
import adhkar from './routes/adhkar.js';

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
    database: {
        sequelize,
        User,
        Post,
        removeColumn,
        addColumn,
    },
    filterSpan,
    emailSender,
    generatePassword,
    checkTextLength
};

app.disable('x-powered-by');
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
await home(param);
await login(param);
await register(param);
await logout(param);
await activate(param);
await quran(param);
await adhkar(param);

app.use(function (request, response, next) {
    let options = {
        website_name: config.WEBSITE_NAME,
        title: `الصفحة غير موجودة 404 - ${config.WEBSITE_NAME}`,
        keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
        description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
        preview: "صورة_المعاينة_للصفحة",
        status: 404
    };
    let pugPath = path.join(__dirname, './views/Error.pug');
    let render = pug.renderFile(pugPath, { options, jsStringify });
    response.status(404).send(render);
});

app.use(function (err, request, response, next) {
    // Handle the error
    console.error(err);
    let options = {
        website_name: config.WEBSITE_NAME,
        title: `خطأ في الخادم الداخلي 505 - ${config.WEBSITE_NAME}`,
        keywords: ["صفحة الخطأ 505", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "505", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
        description: "صفحة الخطأ 505 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
        preview: "صورة_المعاينة_للصفحة",
        errorMassage: err,
        status: 500
    };
    let pugPath = path.join(__dirname, './views/Error.pug');
    let render = pug.renderFile(pugPath, { options, jsStringify });
    response.status(500).send(render);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});