import fs from "node:fs";
export default async function readFile(path) {
  try {
    let fileContent = await fs.promises.readFile(path);
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Error reading file: ${path}`);
  }
}