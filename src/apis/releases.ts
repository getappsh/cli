import axios from "axios"
import { conf } from "./paths"
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { ProjectApiFp, RegulationDto, ReleaseDto, CatalogUploadApiFp, SetRegulationStatusDto, SetReleaseArtifactDto, SetReleaseDto } from "../../client-api/src";

export const getRel = async (projId: number, projToken: string, version: string): Promise<ReleaseDto> => {
  const setRelFn = await CatalogUploadApiFp(conf).releasesControllerGetRelease(projId.toString(), version, projToken)
  return (await setRelFn()).data
}

export const setRel = async (data: SetReleaseDto, projToken: string, projId: number) => {
  try {
    const setRelFn = await CatalogUploadApiFp(conf).releasesControllerSetRelease(projId.toString(), data, projToken)
    return await setRelFn()
  } catch (err: any) {
    console.log(`Failed to set release, Err: ${err.toString()}`);
    process.exit(1)
  }
}

export const getReg = async (projId: number, projToken: string): Promise<RegulationDto[]> => {
  const setRelFn = await ProjectApiFp(conf).projectManagementControllerGetProjectRegulations(projId.toString(), projToken)
  return (await setRelFn()).data
}

export const uploadArt = async (data: SetReleaseArtifactDto, projToken: string, projId: number, version: string) => {
  try {
    const uploadFn = await CatalogUploadApiFp(conf).releasesControllerSetReleaseArtifact(projId.toString(), version, data, projToken)
    return await uploadFn()
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

export const updateReg = async (data: SetRegulationStatusDto, projToken: string, projectId: number, version: string, name: string) => {
  try {
    const setRegFn = await CatalogUploadApiFp(conf).releasesControllerSetRegulationStatus(projectId.toString(), version, name, data, projToken)
    return await setRegFn()
  } catch (error: any) {
    // TODO if the regulation name is incorrect
    console.error(`Set regulation status failed: Error: ${error.toString()}`)
    process.exit(1)
  }
}