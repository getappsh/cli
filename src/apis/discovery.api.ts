
import { BASE_PATH, DISCOVERY } from "./paths.js";
import { getTokens, readFromFile } from "../utils/files.js";
import { errorHandler } from '../handlers/errors-handler.js';

export const sendDiscoveryMessage = async (filePath: string) => {
  const path = BASE_PATH + DISCOVERY

  const data = JSON.parse(await readFromFile(filePath) || "")

  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await getTokens()).accessToken}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resData = await res.json();
    console.log(resData);
  } catch (error) {
    errorHandler(error, () => sendDiscoveryMessage(filePath));
  }
}