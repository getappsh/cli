import axios from 'axios';
import { refreshHandler } from "./login.handler.js";

export const errorHandler = async (error, callback) => {
  if (error && !error.response) {
    return console.error(error)
  }

  if (error && error.response) {

    const res = error.response

    if (res.status !== 401) {
      return console.error(res.data)
    }

    if (res.status === 401) {
      try {
        await refreshHandler()
        return await callback()
        // return await axios(originalRequest)
      } catch (error) {
        errorHandler(error)
      }
    }
    console.error(error.response.data);
  }
  else if (error) {
    console.error(error)
  }
}