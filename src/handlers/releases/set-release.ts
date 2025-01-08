import { sendRelSet } from "../../apis/releases";
import { ReleaseSetOptions } from "../../types/release";
import { readFromFile } from "../../utils/files";
import { ProjToken } from "../token.handler";

export const handleSetRelease = async (version: string, options?: ReleaseSetOptions) => {

  const projToken = await ProjToken.getTokenOrExit(options?.token) ?? ""

  const { projectId } = ProjToken.extractProjId(projToken ?? "")

  let metadate: Record<string, any> | undefined = undefined
  if (options?.metadata) {
    metadate = JSON.parse(options.metadata)
  } else if (options?.metadataFile) {
    metadate = readFromFile(options.metadataFile)
  }

  const data = {
    version,
    name: options?.name,
    releaseNotes: options?.notes,
    metadate,
  }

  await sendRelSet(data, projToken, projectId)

}