import axios from "axios"
import { ARTIFACT, BASE_PATH, PROJECT, RELEASES, VERSION } from "./paths"
import { createReadStream } from "fs";
import { stat } from "fs/promises";

export const sendRelSet = async (data: any, projToken: string, projId: number) => {
  const config = {
    headers: {
      'X-Project-Token': `${projToken}`
    }
  };
  try {
    const res = await axios.post(BASE_PATH + RELEASES + PROJECT + projId, data, config)
    return res
  } catch (err: any) {
    console.log(`Failed to set release, Err: ${err.toString()}`);
    process.exit(1)
  }
}

export const sendUploadArt = async (data: any, projToken: string, projId: number, version: string) => {
  const config = {
    headers: {
      'X-Project-Token': `${projToken}`
    }
  };
  try {
    const res = await axios.post(BASE_PATH + RELEASES + PROJECT + projId + "/" + VERSION + version + "/" + ARTIFACT, data, config)
    return res
  } catch (err: any) {
    console.log(`Failed to upload artifact, Err: ${err.toString()}`);
    process.exit(1)
  }
}

export const uploadFileArt = async (url: string, path: string) => {
  const fileData = createReadStream(path);
  const fileStat = await stat(path);
  try {
    console.log('Uploading artifact ...');
    await axios.put(url, fileData, { headers: { 'Content-Length': fileStat.size } });
    console.log('File uploaded successfully');
  } catch (error: any) {
    console.error(`Upload artifact failed: Error: ${error.toString()}`);
    process.exit(1)
  }
}