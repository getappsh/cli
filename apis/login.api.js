import axios from "axios";

import { BASE_PATH, LOGIN, REFRESH } from "./paths.js";

// post username and password to receive access and refresh tokens 
export const sendLogin = async (data) => {
  return await axios.post(BASE_PATH + LOGIN, data)
}

// post a refresh token to receive a new access token 
export const sendRefresh = async (data) => {
  return await axios.post(BASE_PATH + REFRESH, data)
}

