import axios from "axios";

import { BASE_PATH, conf, REFRESH } from "./paths.js";
import { LoginApiFp } from "../../client-api/src/index.js";

// post username and password to receive access and refresh tokens 
export const sendLogin = async (data: { username: string; password: string }) => {
  const loginFn = await LoginApiFp(conf).loginControllerGetToken({ username: data.username, password: data.password })
  return await loginFn()
}

// post a refresh token to receive a new access token 
export const sendRefresh = async (data: { refreshToken: string }) => {
  return await axios.post(BASE_PATH + REFRESH, data)
}
