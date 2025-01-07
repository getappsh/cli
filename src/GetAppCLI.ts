#!/usr/bin/env node
import { Command } from 'commander';
import { loginHandler } from './handlers/login.handler.js';
import { sendUploadMessage } from './apis/upload.api.js';
import { sendDiscoveryMessage } from './apis/discovery.api.js';
import { handleSetRelease } from './handlers/releases/set-release.js';
import { ReleaseSetOptions } from './types/release.js';

let projectToken: any

const program = new Command();

program.name('getapp-cli').description('CLI for app management').version('1.1.3');


const tknCmd = program.command('token').description("")

// 'set' command: Set the project token
tknCmd.command('set')
  .description('Set the project token')
  .argument('<token>', 'The token to set for the project') // Detailed argument description
  .action((token) => {
    projectToken = token;
    console.log(`Project token has been set to: ${projectToken}`);
  });

// 'get' command: Retrieve the project token
tknCmd.command('get')
  .description('Get the current project token')
  .action(() => {
    if (projectToken) {
      console.log(`Current project token: ${projectToken}`);
    } else {
      console.log('No project token has been set.');
    }
  });

// 'clear' command: Clear the project token
tknCmd.command('clear')
  .description('Clear the project token')
  .action(() => {
    projectToken = null; // Reset the token
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