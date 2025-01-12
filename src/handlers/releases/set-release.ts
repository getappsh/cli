import { SetReleaseDto } from "../../../client-api/src";
import { sendRelSet } from "../../apis/releases";
import { ReleaseSetOptions } from "../../types/release";
import { readFromFile } from "../../utils/files";
import { ProjToken } from "../token.handler";

export const handleSetRelease = async (version: string, options?: ReleaseSetOptions) => {

  if (options?.metadata && options?.metadataFile) {
    console.error('Error: Cannot use both -m and -M options simultaneously.');
    process.exit(1);
  }

  const projToken = await ProjToken.getTokenOrExit(options?.token) ?? ""

  const { projectId } = ProjToken.extractProjId(projToken ?? "")

  let metadata: Record<string, any> | undefined;

  const parseMetadata = (data: string) => {
    try {
      return JSON.parse(data);
    } catch (err: any) {
      console.error(`Invalid metadata, Err: ${err.toString()}`);
      process.exit(1);
    }
  };

  if (options?.metadata) {
    metadata = parseMetadata(options.metadata);
  } else if (options?.metadataFile) {
    const fileContent = await readFromFile(options.metadataFile).catch((err: any) => {
      console.error(`Failed to read metadata from the given file path - ${options.metadataFile}, Err: ${err.toString()}`);
      process.exit(1);
    });
    metadata = parseMetadata(fileContent);
  }

  const data: SetReleaseDto = {
    version,
    name: options?.name,
    releaseNotes: options?.notes,
    metadata,
  }

  await sendRelSet(data, projToken, projectId)
  console.log(`Release ${version} set successfully`)

}