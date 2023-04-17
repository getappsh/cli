import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs'

import { getTokens, readFromFile } from '../utils/files.js';
import { BASE_PATH, UPLOAD_ARTIFACT, UPLOAD_MANIFEST } from './paths.js';
import { errorHandler } from '../handlers/errors-handler.js';

const artifactUpload = async (path, data, config) => {
  try {
    const res = await axios.post(path, data, config)
    console.log(res.data);
  } catch (error) {
    errorHandler(error, () => artifactUpload(path, data, config));
  }
}

const manifestUpload = async (path, data, config) => {
  const body = new FormData();
  body.append('file', createReadStream(data.filePath));
  body.append('uploadToken', data.uploadToken)

  const zipBody = new FormData();
  zipBody.append('file', createReadStream(data.zipFolder))

  try {
    const res = await axios.post(path, body, config)
    console.log(res.data);
    await axios.put(res.data.uploadUrl, zipBody)
    console.log("Uploaded successfully");
  } catch (error) {
    errorHandler(error, () => manifestUpload(path, data, config));
  }
}

export const sendUploadMessage = async (filePath, zipFolder, uploadToken) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${(await getTokens()).accessToken}`
    }
  };

  if (!uploadToken) {
    const data = JSON.parse(await readFromFile(filePath))
    console.log(data);
    const path = BASE_PATH + UPLOAD_ARTIFACT
    artifactUpload(path, data, config)
  } else {
    const path = BASE_PATH + UPLOAD_MANIFEST
    manifestUpload(
      path,
      { filePath, zipFolder, uploadToken },
      config
    )
  }
}


