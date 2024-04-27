import fs from "node:fs";
import path from "node:path";
import { config } from "../config.js";

const logsDir = path.resolve(config.paths.logs);
const errorLogPath = path.resolve(logsDir, "error.log");
const infoLogPath = path.resolve(logsDir, "info.log");

// Initialize logger
try {
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    await fs.promises.mkdir(logsDir);
  }

  if (!fs.existsSync(infoLogPath)) {
    await fs.promises.writeFile(infoLogPath, "");
  }

  if (!fs.existsSync(errorLogPath)) {
    await fs.promises.writeFile(errorLogPath, "");
  }
} catch (error) {
  console.error("Error initializing log files:", error);
}

// Log error message
export const logError = (message) => {
  const logMessage = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(errorLogPath, logMessage);
};

// Log info message
export const logInfo = (message) => {
  const logMessage = `[INFO] ${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(infoLogPath, logMessage);
};
