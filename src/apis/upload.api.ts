import axios from 'axios';
import FormData from 'form-data';
import { createReadStream, statSync, readFileSync } from 'fs'

import { getTokens, readFromFile } from '../utils/files.js';
import { BASE_PATH, STATUS_UPDATE, UPLOAD_ARTIFACT, UPLOAD_MANIFEST } from './paths.js';
import { errorHandler } from '../handlers/errors-handler.js';

const artifactUpload = async (path: string, data: any, config: any) => {
  try {
    const res = await axios.post(path, data, config)
    console.log(res.data);
  } catch (error) {
    errorHandler(error, () => artifactUpload(path, data, config));
  }
}

function getAssetType(path: string) {
  let assetType = "artifact"
  try {
    const manifestContent = readFileSync(path, 'utf-8');
    const manifestJson = JSON.parse(manifestContent);

    assetType = manifestJson.assetType ?? assetType;
  } catch (e) {
    console.log('Failed to read manifest file, ' + e)
  }
  return assetType

}

const manifestUpload = async (path: string, data: any, config: any) => {
  const form = new FormData();
  console.log(data);


  form.append('file', createReadStream(data.manifestPath));
  form.append('uploadToken', data.uploadToken)

  const updateStatus: any = {}
  updateStatus.uploadToken = data.uploadToken

  try {
    const assetType = getAssetType(data.manifestPath);
    console.log("Asset type: " + assetType);

    const res = await axios.post(path, form, config)
    updateStatus.catalogId = res.data.catalogId
    console.log("Start file upload...");

    if (assetType == 'docker_image') {
      console.log("Uploaded successfully");
      return
    }
    const fileData = createReadStream(data.filePath);
    const fileStat = statSync(data.filePath);
    try {
      await axios.put(res.data.uploadUrl, fileData, { headers: { 'Content-Length': fileStat.size } });
      console.log("Uploaded successfully");
      updateStatus.status = "ready";
      const _statusRes = await axios.post(BASE_PATH + STATUS_UPDATE, updateStatus, config)
      console.log("Status updated successfully");
    } catch (error) {
      updateStatus.status = "error";
      await axios.post(BASE_PATH + STATUS_UPDATE, updateStatus, config)
      errorHandler(error, () => { })
    }
  } catch (error) {
    errorHandler(error, () => manifestUpload(path, data, config));
  }
}

export const sendUploadMessage = async (detailsPath: string, filePath: string, uploadToken: string) => {

  const config = {};

  if (!uploadToken) {
    const data = JSON.parse(await readFromFile(detailsPath) || "")
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

