#!/usr/bin/env node

import { Command } from 'commander';
import { loginHandler } from './handlers/login.handler.js';
import { sendUploadMessage } from './apis/upload.api.js';
import { sendDiscoveryMessage } from './apis/discovery.api.js';
import { handleSetRelease } from './handlers/releases/set-release.js';
import { FileType, ReleaseSetOptions, SetRegOptions, UploadArtOptions } from './types/release.js';
import { ProjToken } from './handlers/token.handler.js';
import { handleUploadArt } from './handlers/releases/upload-art.js';
import { handleSetReg } from './handlers/releases/set-reg.js';

const program = new Command();

const version = process.env.VERSION || 'unknown';
program.name('getapp-cli').description('CLI for app management').version(version);

const relCmd = program
  .command('releases')
  .description('Manage releases, including creation, uploading artifacts, sending regulation statuses, and other release-related operations.');

relCmd
  .command('set')
  .description('Create or set a release version, including associated artifacts and statuses.')
  .argument('<version>', 'The version number for the release (e.g., "1.0.0")')
  .option('-t,  --token <token>', 'Token to authenticate the release process')
  .option('-nt, --notes <notes>', 'Comma-separated list of release notes describing changes or updates in the release')
  .option('-m,  --metadata <json-string>', 'Additional metadata for the release, in JSON string format (e.g., \'{"key": "value"}\')')
  .option('-mf, --metadata-file <file>', 'Path to a metadata file containing JSON data')
  .option('-n,  --name <name>', 'Name of the release')
  .option('-d,  --draft', 'Mark the release as a draft (boolean flag)')
  .action((version: string, options: ReleaseSetOptions) => {
    handleSetRelease(version, options)
  })

relCmd
  .command('art')
  .description('Upload artifacts')
  .argument('<version>', 'The version number for the release (e.g., "1.0.0")')
  .argument('<type>', `The file type to upload, can be ${Object.values(FileType).map(t => `'${t}'`).join(', ')}`)
  .option('-t,  --token <token>', 'Token to authenticate the release process')
  .option('-m,  --metadata <json-string>', 'Additional metadata for the release, in JSON string format (e.g., \'{"key": "value"}\')')
  .option('-mf, --metadata-file <file>', 'Path to a metadata file containing JSON data')
  .option('-n,  --name <name>', 'Name of the artifact, this name affects the file name')
  .option('-d,  --deployable', 'Indicates that the artifact is a deployable installation file')
  .option('-f,  --file <path>', 'Specify the file path to the artifact to be uploaded (required for file type artifacts)')
  .option('-u,  --docker-image-url <url>', 'URL of the Docker image for the deployable artifact (required for Docker type artifacts)')
  .action((version: string, type: FileType, options: UploadArtOptions) => {
    handleUploadArt(version, type, options);
  });

relCmd
  .command('reg')
  .description('Manage and update regulation statuses, and upload related artifacts')
  .argument('<version>', 'Version number of the release (e.g., "1.0.0")')
  .argument('<name>', 'Name of the regulation to update')
  .option('-t, --token <token>', 'Authentication token for the release process')
  .option('-v, --value <value>', 'Regulation value to set (e.g., a number or boolean)')
  .option('-f, --file <path>', 'Path to the file artifact to be uploaded (required if the regulation includes file content)')
  .action((version: string, name: string, options: SetRegOptions) => {
    handleSetReg(version, name, options);
  });

const tknCmd = program.command('token').description("")

tknCmd.command('set')
  .description('Set the project token')
  .argument('<token>', 'The token to set for the project') // Detailed argument description
  .action((token) => {
    ProjToken.setToken(token)
    console.log(`Project token has been set to: ${token}`);
  });

tknCmd.command('get')
  .description('Get the current project token')
  .action(async () => {
    const token = await ProjToken.getToken()
    if (token) {
      console.log(`Current project token: ${token}`);
    } else {
      console.log('No project token has been set.');
    }
  });

tknCmd.command('clear')
  .description('Clear the project token')
  .action(() => {
    ProjToken.clearToken()
    console.log('Project token has been cleared.');
  });



program
  .command('login')
  .description('Login with user and password')
  .argument('<username>', 'username')
  .argument('<password>', 'password')
  .action((username, password) => {
    loginHandler(username, password);
  });

program
  .command('upload')
  .description('Upload new version message')
  .argument('<detailsPath>', 'path of upload details/manifest file')
  .argument('<filePath>', 'path of file on manifest upload')
  .argument('<uploadToken>', 'upload token on manifest upload')
  .action((detailsPath, filePath, uploadToken) => {
    sendUploadMessage(detailsPath, filePath, uploadToken);
  });

program
  .command('discovery')
  .description('Send discovery message by device')
  .argument('<token>', 'discovery token')
  .argument('<discoveryMessage>', 'discovery message')
  .action((token, discoveryMessage) => {
    sendDiscoveryMessage(token);
  });

program.parse(process.argv);