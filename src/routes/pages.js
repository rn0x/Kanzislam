import fs from "node:fs";
import { config } from "../config.js";
import { logError, logInfo } from "../utils/logger.js";

import express from "express";
const router = express.Router();

/* SYNCDATA */
import { syncData, dataCheck } from "../utils/syncData.js";
await syncData();
await dataCheck();

// FS READ FUNCTION
async function readFile(path) {
  try {
    let fileContent = await fs.promises.readFile(path);
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`خطأ في قراءة الملفات ${path}`);
  }
}

const logger = { logError, logInfo };

/* RADIO ROUTER */
import radio from "./pages/radio.js";
await radio(router, config, readFile, logger);

/* ADHKAR ROUTER */
import adhkar from "./pages/adhkar.js";
await adhkar(router, config, readFile, logger);

/* QURAN ROUTER */
import quran from "./pages/quran.js";
await quran(router, config, readFile, logger);

/* HISN ALMUSLIM ROUTER */
import hisnmuslim from "./pages/hisnmuslim.js";
await hisnmuslim(router, config, readFile, logger);

/* TAFSIR QURAN ROUTER */
import tafsir from "./pages/tafsir.js";
await tafsir(router, config, readFile, logger);

/* HISTORY ISLAM ROUTER */
import history from "./pages/history.js";
await history(router, config, readFile, logger);

/* FATAAWA IBN BAAZ ROUTER */
import fatwas from "./pages/fatwas.js";
await fatwas(router, config, readFile, logger);

/* SABHA ROUTER */
import sabha from "./pages/sabha.js";
await sabha(router);

/* PRAYER TIME ROUTER */
import prayer from "./pages/prayer.js";
await prayer(router);

export default router;