import { stat } from "fs/promises";
import { sendUploadArt, updateReg, uploadFileArt } from "../../apis/releases";
import { FileType, SetRegOptions } from "../../types/release";
import { ProjToken } from "../token.handler";
import { SetRegulationStatusDto, SetReleaseArtifactDto } from "../../../client-api/src";
import path from "path";

const fileValidator = async (path: string) => {
  try {
    const stats = await stat(path);
    if (!stats.isFile()) {
      console.error(`Validation Error: The provided path "${path}" is not a valid file.`);
      process.exit(1);
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`Error: The file at path "${path}" does not exist.`);
    } else {
      console.error(`Error: Unable to access the file at path "${path}": ${error.message}`);
    }
    process.exit(1);
  }

}

const validateSetRegOptions = async (options?: SetRegOptions) => {
  if (options?.file && options?.value) {
    console.error('Validation Error: Both "-f" (file) and "-v" (value) options cannot be used simultaneously.');
    process.exit(1);
  }

  if (!options?.value && !options?.file) {
    console.error('Validation Error: Either "-v" (value) or "-f" (file) option must be provided.');
    process.exit(1);
  }

  if (options?.file) {
    await fileValidator(options.file);
  }
};


export const handleSetReg = async (version: string, name: string, options?: SetRegOptions) => {

  try {

    validateSetRegOptions(options)

    const projToken = await ProjToken.getTokenOrExit(options?.token) ?? ""

    const { projectId } = ProjToken.extractProjId(projToken ?? "")

    if (options?.value) {
      const data: SetRegulationStatusDto = {
        value: options.value
      }
      await updateReg(data, projToken, projectId, version, name)
    } else if (options?.file) {
      const data: SetReleaseArtifactDto = {
        artifactName: path.basename(options.file),
        type: FileType.FILE,
        isInstallationFile: false,
      }

      const res = await sendUploadArt(data, projToken, projectId, version);

      if (res.data.uploadUrl) {
        await uploadFileArt(res.data.uploadUrl, options?.file)
        const data: SetRegulationStatusDto = {
          value: res.data.artifactId.toString()
        }
        await updateReg(data, projToken, projectId, version, name)
      }
    }

    console.log(`Successfully completed regulation update for release version=${version}`);
  } catch (error: any) {
    console.error(`Unexpected Error: ${error.message}`);
    process.exit(1);
  }
}


