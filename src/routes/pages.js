import fs from "node:fs";
import { config } from "../config.js";

import express from "express";
const router = express.Router();

// FS READ FUNCTION
async function readFile(path) {
  let fileContent = await fs.promises.readFile(path);
  return JSON.parse(fileContent);
}

/* /RADIO ROUTER */
import radio from "./modules/radio.js";
await radio(router, config, readFile);

export default router;
