#!/usr/bin/env node
import { Command } from 'commander';
import { loginHandler } from './handlers/login.handler.js';
import { sendUploadMessage } from './apis/upload.api.js';
import { sendDiscoveryMessage } from './apis/discovery.api.js';
import { handleSetRelease } from './handlers/releases/set-release.js';
import { ReleaseSetOptions } from './types/release.js';
import { ProjToken } from './handlers/token.handler.js';

const program = new Command();

program.name('getapp-cli').description('CLI for app management').version('1.1.3');


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