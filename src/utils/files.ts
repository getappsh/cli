import { writeFile, existsSync, mkdirSync, promises as fs } from 'fs';
import { errorHandler } from '../handlers/errors-handler.js';

const getDirPath = (path: string) => {
  const filePath = process.cwd() + "\\src\\data";

  const pathParts = path.split("/");
  let fileName = pathParts[pathParts.length - 1];

  fileName = filePath + "\\" + fileName;

  if (!existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }
  return fileName;
}



export const writeToFile = (path: string, data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    writeFile(getDirPath(path), data, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const readFromFile = async (filePath: string, internal = false) => {
  return await fs.readFile(internal ? getDirPath(filePath) : filePath, "utf-8")
}

export const getTokens = async () => {
  try {
    const tokens = await readFromFile(getDirPath("src/data/login.json"))
    return JSON.parse(tokens || "")
  } catch (error) {
    errorHandler(error)
  }
}


