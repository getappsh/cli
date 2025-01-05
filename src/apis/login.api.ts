
import { BASE_PATH, LOGIN, REFRESH } from "./paths.js";

// post username and password to receive access and refresh tokens 
export const sendLogin = async (data: { username: string; password: string }) => {
  const response = await fetch(BASE_PATH + LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

// post a refresh token to receive a new access token 
export const sendRefresh = async (data: { refreshToken: string }) => {
  const response = await fetch(BASE_PATH + REFRESH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

