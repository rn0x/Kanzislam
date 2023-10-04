import express from 'express';
import session from 'express-session';
import bodyParser from "body-parser";
import fs from 'fs-extra';
import path from 'path';
import pug from 'pug';
import jsStringify from 'js-stringify';
import {
    sequelize,
    User,
    Post,
    removeColumn,
    addColumn
} from './modules/database.js';
import home from './routes/home.js';
import login from './routes/login.js';
import register from './routes/register.js';

// Get the current working directory
const __dirname = path.resolve();
const configPath = path.join(__dirname, './config.json');
const config = await fs.readJson(configPath).catch(() => ({}));
const app = express();
const port = config?.PORT || 3000;
const param = {
    app: app,
    pug: pug,
    path: path,
    fs: fs,
    config: config,
    __dirname: __dirname,
    jsStringify: jsStringify,
    database: {
        sequelize: sequelize,
        User: User,
        Post: Post,
        removeColumn: removeColumn,
        addColumn: addColumn
    }
}

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config?.SESSION_SECRET, // مفتاح سري يتم استخدامه لتشفير الجلسة
    resave: false, // إعادة حفظ الجلسة حتى في حالة عدم تغييرها
    saveUninitialized: true // حفظ الجلسة حتى لو لم يتم تهيئتها
}));

// routes
await home(param); // الصفحة الرئيسية
await login(param); // صفحة تسجيل الدخول
await register(param); // صفحة تسجيل عضوية


app.use(function (req, res, next) {
    res.status(404).send("الصفحة غير موجودة.");
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});