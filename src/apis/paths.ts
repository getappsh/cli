import * as dotenv from 'dotenv'
import { Configuration } from '../../client-api/src/configuration';
dotenv.config();

export const BASE_PATH = process.env.GET_APP_PATH;

export const LOGIN = 'login';
export const REFRESH = 'login/refresh';

export const RELEASES = "releases/"
export const PROJECT = "project/"
export const VERSION = "version/"
export const ARTIFACT = "artifact/"

export const UPLOAD_ARTIFACT = "upload/artifact"
export const UPLOAD_MANIFEST = "upload/manifest"
export const STATUS_UPDATE = "upload/updateUploadStatus"

export const DISCOVERY = "discovery"

export const conf = new Configuration({ basePath: BASE_PATH })