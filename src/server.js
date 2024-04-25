import "dotenv/config";

import express from "express";
const app = express();

import { config } from "./config.js";
import { logError, logInfo } from "./utils/logger.js";

import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import favicon from "serve-favicon";

/* SYNCDATA */
import syncData from "./utils/syncData.js";
await syncData();

// المتغيرات العامة في res.locals
app.use((req, res, next) => {
  res.locals.website_name = config.website_name;
  res.locals.MainPreview = config.preview;
  // يمكنك تحديد المتغيرات العامة الأخرى هنا
  next();
});

app.use(helmet(config.helmet));
app.use(compression(config.compression));

app.use(express.static(config.paths.public, { maxAge: 31536000 }));
app.use(favicon(config.paths.favicon));

app.set("view engine", "pug");
app.set("views", config.paths.views);

app.use(bodyParser.urlencoded({ extended: config.bodyParser.extended }));
app.use(bodyParser.json({ limit: config.bodyParser.limit }));
app.disable('x-powered-by');

/* HOME */
app.get("/", async (req, res, next) => {
  res.render("home");
});

/* ROUTES */
import pagesRouter from "./routes/pages.js";
import errorRouter from "./routes/error.js";
app.use("/", pagesRouter)
app.use("/", errorRouter);


/* NOT FOUND */
app.use((req, res, next) => {
  res.status(404).render("error", {
    title: `الصفحة غير موجودة 404`,
    keywords: ["صفحة الخطأ 404", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 404"],
    description: "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
    status: 404,
    errorTitle: "الصفحة غير موجودة",
  });
});

if (config.isProd) {
  /* INTERNAL SERVER ERROR */
  app.use((err, req, res, next) => {
    logError(err.message);
    res.status(500).render("error", {
      title: "خطأ في الخادم الداخلي 500",
      keywords: ["صفحة الخطأ 500", "عنوان URL غير صحيح", "عنوان URL غير موجود", "error", "500", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "صفحة غير متاحة", "رسالة الخطأ 500", "خطأ في الخادم الداخلي"],
      description: `صفحة الخطأ 500 تعني "خطأ في الخادم الداخلي" وتظهر عندما يحدث خطأ تقني داخل الخادم يعيقه عن معالجة الطلب بشكل صحيح.`,
      status: 500,
      errorTitle: "خطأ في الخادم الداخلي",
    });
  });
}

const server = app.listen(config.port, () => {
  if (config.isDev === true) {
    console.log(`[Kanzislam] Server started on port ${config.port}`);
  } else if (config.isProd === true) {
    console.log(`[Kanzislam] Server started, Production environment.`);
  }
});

function sigHandle(signal) {
  logInfo(`${signal} signal received.`);
  server.close(() => {
    console.log("[Kanzislam] Server closed.");
  });
}

process.on("SIGINT", sigHandle);
process.on("SIGTERM", sigHandle);
