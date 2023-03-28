import axios from 'axios';

import { BASE_PATH, DISCOVERY } from "./paths.js";
import { getTokens, readFromFile } from "../utils/files.js";
import { errorHandler } from '../handlers/errors-handler.js';

export const sendDiscoveryMessage = async (filePath) => {
  const path = BASE_PATH + DISCOVERY

  const data = JSON.parse(await readFromFile(filePath))

  const config = {
    headers: {
      'Authorization': `Bearer ${(await getTokens()).accessToken}`
    }
  };

  try {
    const res = await axios.post(path, data, config)
    console.log(res.data);
  } catch (error) {
    errorHandler(error, () => sendDiscoveryMessage(filePath));
  }
}