#!/usr/bin/env node
import { Command } from 'commander';
import { loginHandler } from './handlers/login.handler.js';
import { sendUploadMessage } from './apis/upload.api.js';
import { sendDiscoveryMessage } from './apis/discovery.api.js';

const program = new Command();

program.name('getapp').description('CLI for app management').version('1.1.0');

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
  .argument('<details>', 'path of upload details file')
  .argument('<zipFile>', 'path of zip file of manifest upload')
  .argument('<uploadToken>', 'upload token of manifest upload')
  .action((details, zipFile, uploadToken) => {
    sendUploadMessage(details, zipFile, uploadToken);
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