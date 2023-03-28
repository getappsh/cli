import { sendLogin, sendRefresh } from "../apis/login.api.js";
import { getTokens, writeToFile } from "../utils/files.js";
import { errorHandler } from './errors-handler.js';

export const loginHandler = async (username, password) => {
  const data = {
    username,
    password
  };
  try {
    const res = await sendLogin(data);
    let tokens = JSON.stringify(res.data)
    writeToFile("data/login.json", tokens)
    console.log("logged in");
  } catch (error) {
    errorHandler(error)
  }
}


export const refreshHandler = async () => {
 const refreshToken = (await getTokens()).refreshToken
  try {
    const res = await sendRefresh({refreshToken});
    let tokens = JSON.stringify(res.data)
    writeToFile("data/login.json", tokens)
    console.log("token refreshed");
  } catch (error) {
    errorHandler(error)
  }
}