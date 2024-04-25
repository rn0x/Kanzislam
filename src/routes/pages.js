import fs from "node:fs";
import { config } from "../config.js";

import express from "express";
const router = express.Router();

// FS READ FUNCTION
async function readFile(path) {
  let fileContent = await fs.promises.readFile(path);
  return JSON.parse(fileContent);
}

/* RADIO ROUTER */
import radio from "./pages/radio.js";
await radio(router, config, readFile);

/* ADHKAR ROUTER */
import adhkar from "./pages/adhkar.js";
await adhkar(router, config, readFile);

export default router;