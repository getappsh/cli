import {writeFile, existsSync, mkdirSync, promises as fs } from 'fs';
import { errorHandler } from '../handlers/errors-handler.js';

const getDirPath = (path) =>{
  const filePath = process.cwd() + "\\data";
  
  let fileName = path.split("/");
  fileName = fileName[fileName.length - 1];

  fileName = filePath + "\\" + fileName;

  if (existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }
  return fileName;
}



export const writeToFile = (path, data) => {
  try {
    writeFile(getDirPath(path), data, (err) => {
      errorHandler(err)
    });
  } catch (error) {
    console.log("err: ", error);

  }
}

export const readFromFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch (error) {
    errorHandler(error)
  }
}

export const getTokens = async () => {
  try {
    const tokens = await readFromFile(getDirPath("data/login.json"))
    return JSON.parse(tokens)
  } catch (error) {
    errorHandler(error)
  }
}


