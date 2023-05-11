import * as dotenv from 'dotenv'
dotenv.config();

export const BASE_PATH = process.env.BASE_PATH;

export const LOGIN = 'login';
export const REFRESH = 'login/refresh';

export const UPLOAD_ARTIFACT = "upload/artifact"
export const UPLOAD_MANIFEST = "upload/manifest"
export const STATUS_UPDATE = "upload/updateUploadStatus"

export const DISCOVERY = "discovery"