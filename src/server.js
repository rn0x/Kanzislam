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

app.use(helmet(config.helmet));
app.use(compression(config.compression));

app.use("/static", express.static(config.paths.static, { maxAge: 31536000 }));
app.use(favicon(config.paths.favicon));

app.set("view engine", "pug");
app.set("views", config.paths.views);

app.use(bodyParser.urlencoded({ extended: config.bodyParser.extended }));
app.use(bodyParser.json({ limit: config.bodyParser.limit }));

/* HOME */
app.get("/", async (req, res, next) => {
  res.render("home");
});

/* ROUTES */
// import pagesRouter from "./routes/pages.js";
import errorRouter from "./routes/error.js";
// app.use("/", pagesRouter)
app.use("/", errorRouter);


/* NOT FOUND */
app.use((req, res, next) => {
  res.status(404).render("error", {
    status: 404,
    errorTitle: "الصفحة غير موجودة",
  });
});

if (config.isProd) {
  /* INTERNAL SERVER ERROR */
  app.use((err, req, res, next) => {
    logError(err.message);
    res.status(500).render("error", {
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
