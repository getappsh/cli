import { readFromFile, writeToFile } from "../utils/files"

export class ProjToken {
  static FILE_NAME = "projToken.txt"

  static async setToken(token: string, exit = true) {
    await writeToFile(this.FILE_NAME, token).catch((err: any) => {
      console.log("Failed to set project token: Err:", err.toString());
      if (exit) {
        process.exit(1)
      }
      throw err
    })
  }

  static async getToken(exit = true) {
    return await readFromFile(this.FILE_NAME, true).catch((err: any) => {
      console.log("Failed to get project token: Err:", err.toString());
      if (exit) {
        process.exit(1)
      }
      throw err
    })
  }

  static async getTokenOrExit(token?: string) {
    if (token) return token
    try {
      if (token = await readFromFile(this.FILE_NAME, true)) return token
    } catch (error: any) {
      console.error('Error: Token is required but not provided.', error.toString());
      process.exit(1)
    }
  }

  static async clearToken(exit = true) {
    await writeToFile(this.FILE_NAME, "").catch((err: any) => {
      console.log("Failed to clear project token: Err:", err.toString());
      if (exit) {
        process.exit(1)
      }
      throw err
    })
  }

  static extractProjId(projToken: string): { projectId: number; projectName: string } {
    try {
      const arrayToken = projToken.split('.');
      const tokenPayload = JSON.parse(atob(arrayToken[1]));
      const { projectId, projectName } = tokenPayload['data'];
      return { projectId, projectName }
    } catch (err: any) {
      console.error(`Token not valid, Err: ${err.toString()}`)
      process.exit(1)
    }
  }
}