import FormData from 'form-data';
import { createReadStream, statSync, readFileSync } from 'fs'

import { getTokens, readFromFile } from '../utils/files.js';
import { BASE_PATH, STATUS_UPDATE, UPLOAD_ARTIFACT, UPLOAD_MANIFEST } from './paths.js';
import { errorHandler } from '../handlers/errors-handler.js';

const artifactUpload = async (path: string, data: any, config: any) => {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify(data)
    }).then(response => response.json());
    console.log(res);
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

    const res: any = await fetch(path, {
      method: 'POST',
      headers: {
        ...config.headers,
      },
      body: form as any
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        return response.json();
      });
    updateStatus.catalogId = res.catalogId
    console.log("Start file upload...");

    if (assetType == 'docker_image') {
      console.log("Uploaded successfully");
      return
    }
    const fileData = readFileSync(data.filePath);
    const fileStat = statSync(data.filePath);
    try {
      const uploadResponse = await fetch(res.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Length': fileStat.size.toString()
        },
        body: fileData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      console.log("Uploaded successfully");
      updateStatus.status = "ready";

      const statusResponse = await fetch(BASE_PATH + STATUS_UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(updateStatus)
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update status');
      }

      console.log("Status updated successfully");
    } catch (error) {
      updateStatus.status = "error";
      await fetch(BASE_PATH + STATUS_UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(updateStatus)
      });
      errorHandler(error);
    }
  } catch (error) {
    console.log("dfdffdfdfd");

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


