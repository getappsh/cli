import { refreshHandler } from "./login.handler.js";

export const errorHandler = async (error: any, callback?: () => any) => {
  if (error && !error.response) {
    console.error(error)
    process.exit(1)
  }

  if (error && error.response) {

    const res = error.response

    if (res.status !== 401) {
      console.error(res.data)
      process.exit(1)
    }

    if (res.status === 401) {
      try {
        await refreshHandler()
        return callback ? await callback() : null
        // return await axios(originalRequest)
      } catch (error) {
        errorHandler(error)
      }
    }
    console.error(error.response.data);
    process.exit(1)
  }
  else if (error) {
    console.error(error)
    process.exit(1)
  }
}