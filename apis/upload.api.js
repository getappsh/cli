import axios from 'axios';
import FormData from 'form-data';
import { createReadStream, statSync } from 'fs'

import { getTokens, readFromFile } from '../utils/files.js';
import { BASE_PATH, STATUS_UPDATE, UPLOAD_ARTIFACT, UPLOAD_MANIFEST } from './paths.js';
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
  body.append('file', createReadStream(data.manifestPath));
  body.append('uploadToken', data.uploadToken)

  const updateStatus = {}
  updateStatus.uploadToken = data.uploadToken

  try {
    const res = await axios.post(path, body, config)
    updateStatus.catalogId = res.data.catalogId
    console.log("Start file upload...");

    const fileData = createReadStream(data.filePath);
    const fileStat = statSync(data.filePath);
    try {
      await axios.put(res.data.uploadUrl, fileData, {headers: {'Content-Length': fileStat.size}});
      console.log("Uploaded successfully");
      updateStatus.status = "ready";
      const _statusRes = await axios.post(BASE_PATH + STATUS_UPDATE, updateStatus, config)
      console.log("Status updated successfully");
    } catch (error) {
      updateStatus.status = "error";
      await axios.post(BASE_PATH + STATUS_UPDATE, updateStatus, config)
      errorHandler(error, () => {}) 
    }
  } catch (error) {
    errorHandler(error, () => manifestUpload(path, data, config));
  }
}

export const sendUploadMessage = async (detailsPath, filePath, uploadToken) => {

  const config = {};

  if (!uploadToken) {
    const data = JSON.parse(await readFromFile(detailsPath))
    const path = BASE_PATH + UPLOAD_ARTIFACT
    artifactUpload(path, data, config)
  } else {
    const path = BASE_PATH + UPLOAD_MANIFEST
    manifestUpload(
      path,
      { manifestPath: detailsPath, filePath, uploadToken },
      config
    )
  }
}


