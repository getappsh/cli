import { stat } from "fs/promises";
import { sendUploadArt, uploadFileArt } from "../../apis/releases";
import { FileType, UploadArtOptions } from "../../types/release";
import { readFromFile } from "../../utils/files";
import { ProjToken } from "../token.handler";
import path from "path";
import { SetReleaseArtifactDto } from "../../../client-api/src";

const fileValidator = async (path: string) => {
  try {
    const stats = await stat(path);
    if (!stats.isFile()) {
      console.error(`Error: The provided path "${path}" is not a file.`);
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

const validateUploadOptions = async (type: FileType, options?: UploadArtOptions) => {

  if (!Object.values(FileType).includes(type as FileType)) {
    console.error(
      `Error: Invalid type '${type}'. Valid types are: ${Object.values(FileType)
        .map((t) => `'${t}'`)
        .join(', ')}.`
    );
    process.exit(1);
  }

  if (options?.metadata && options?.metadataFile) {
    console.error('Error: Cannot use both -m and -M options simultaneously.');
    process.exit(1);
  }

  if (type === FileType.FILE) {
    if (!options?.file) {
      console.error('Error: A file path must be provided using -f or --file for file type artifacts.');
      process.exit(1);
    } else {
      await fileValidator(options.file)
    }
  }

  if (type === FileType.DOCKER && !options?.dockerImageUrl) {
    console.error('Error: A Docker image URL must be provided using -u or --docker-image-url for Docker type artifacts.');
    process.exit(1);
  }

  // if (!options?.deployable && (options?.metadata || options?.metadataFile)) {
  //   console.warn("Warn: mate data is effected only for deployable artifacts")
  // }

  if (options?.metadataFile) {
    await fileValidator(options.metadataFile)
  }
};


const parseMetadata = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (err: any) {
    console.error(`Invalid metadata, Err: ${err.toString()}`);
    process.exit(1);
  }
};

const extractDockerImageName = (dockerImageUrl: string): string | undefined => {
  const regex = /(?:[a-zA-Z0-9.-]+\/)?([a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9.-]+)*)(?::([a-zA-Z0-9.-]+))?/;
  const match = dockerImageUrl.match(regex);

  if (match) {
    const imageName = match[1].split('/').pop();
    return match[2] ? `${imageName}:${match[2]}` : imageName;
  }
};

export const handleUploadArt = async (version: string, type: FileType, options?: UploadArtOptions) => {

  validateUploadOptions(type, options)

  const projToken = await ProjToken.getTokenOrExit(options?.token) ?? ""

  const { projectId } = ProjToken.extractProjId(projToken ?? "")

  let metadata: Record<string, any> | undefined;

  if (options?.metadata) {
    metadata = parseMetadata(options.metadata);
  } else if (options?.metadataFile) {
    const fileContent = await readFromFile(options.metadataFile).catch((err: any) => {
      console.error(`Failed to read metadata from the given file path - ${options.metadataFile}, Err: ${err.toString()}`);
      process.exit(1);
    });
    metadata = parseMetadata(fileContent);
  }

  let name: string | undefined;
  if (options?.name) {
    name = options.name
  } else if (options?.file) {
    name = path.basename(options.file)
  } else if (options?.dockerImageUrl) {
    name = extractDockerImageName(options.dockerImageUrl)
  };

  if (!name) {
    console.error("not valid url and name in not provided, need to set in -n or --name")
    process.exit(1)
  }

  const data: SetReleaseArtifactDto = {
    artifactName: name,
    type,
    isInstallationFile: true,
    // isInstallationFile: options?.deployable,
    dockerImageUrl: options?.dockerImageUrl,
    metadata
  }

  const res = await sendUploadArt(data, projToken, projectId, version);

  if (type == FileType.FILE && res.data.uploadUrl && options?.file) {
    await uploadFileArt(res.data.uploadUrl, options?.file)
  }
  console.log(`Upload artifact for release ${version} finished successfully `);
}

