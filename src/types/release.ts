export interface ReleaseSetOptions {
  token?: string;
  notes?: string;
  metadata?: string;
  metadataFile?: string;
  name?: string;
}

export interface UploadArtOptions {
  token?: string;
  metadata?: string;
  metadataFile?: string;
  name?: string
  deployable: boolean
  dockerImageUrl: string
  file?: string
}

export enum FileType {
  FILE = "file",
  DOCKER = "docker_image"
}

export interface SetRegOptions {
  token?: string;
  value: string;
  file?: string;
}
