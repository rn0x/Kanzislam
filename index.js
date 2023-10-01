import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import pug from 'pug';
import home from './routes/home.js';

// Get the current working directory
const __dirname = path.resolve();
const configPath = path.join(__dirname, './config.json');
const config = await fs.readJson(configPath).catch(() => ({}));
const app = express();
const port = config?.port || 3000;
const param = {
    app: app,
    pug: pug,
    path: path,
    fs: fs,
    config: config,
    __dirname: __dirname
}

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));


// routes
await home(param);


app.use(function (req, res, next) {
    res.status(404).send("الصفحة غير موجودة.");
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});