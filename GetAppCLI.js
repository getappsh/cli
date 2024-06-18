#!/usr/bin/env node
import { Command } from 'commander';
import { loginHandler } from './handlers/login.handler.js';
import { sendUploadMessage } from './apis/upload.api.js';
import { sendDiscoveryMessage } from './apis/discovery.api.js';

const program = new Command();

program.name('getapp-cli').description('CLI for app management').version('1.1.0');

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
    sendDiscoveryMessage(token, discoveryMessage);
  });

program.parse(process.argv);