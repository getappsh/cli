import {writeFile, existsSync, mkdirSync, promises as fs } from 'fs';
import { errorHandler } from '../handlers/errors-handler.js';

const getDirPath = (path: string) =>{
  const filePath = process.cwd() + "\\src\\data";
  
  const pathParts = path.split("/");
  let fileName = pathParts[pathParts.length - 1];

  fileName = filePath + "\\" + fileName;

  if (existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }
  return fileName;
}



export const writeToFile = (path: string, data: string) => {
  try {
    writeFile(getDirPath(path), data, (err) => {
      errorHandler(err)
    });
  } catch (error) {
    console.log("err: ", error);

  }
}

export const readFromFile = async (filePath: string) => {
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch (error) {
    errorHandler(error)
  }
}

export const getTokens = async () => {
  try {
    const tokens = await readFromFile(getDirPath("src/data/login.json"))
    return JSON.parse(tokens || "")
  } catch (error) {
    errorHandler(error)
  }
}


