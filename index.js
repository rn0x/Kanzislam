import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import pug from 'pug';
import jsStringify from 'js-stringify';
import {
    sequelize,
    User,
    Post,
    removeColumn,
    addColumn,
} from './modules/database.js';
import home from './routes/home.js';
import login from './routes/login.js';
import register from './routes/register.js';
import logout from './routes/logout.js';
import quran from './routes/quran.js';

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
    database: {
        sequelize,
        User,
        Post,
        removeColumn,
        addColumn,
    },
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
home(param);
login(param);
register(param);
logout(param);
quran(param);

app.use(function (req, res, next) {
    res.status(404).send('الصفحة غير موجودة.');
});

app.use(function (err, req, res, next) {
    // Handle the error
    console.error(err);

    // Set the response status code
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});