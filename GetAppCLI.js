import { program } from 'commander';

import { loginHandler } from './handlers/login.handler.js';
import { sendUploadMessage } from './apis/upload.api.js';
import { sendDiscoveryMessage } from './apis/discovery.api.js';


program
  .option('-l, --login <username, password>', 'login with user and password')
  .option('-u, --upload <details, zip file, upload token>', 'upload new version message')
  .option('-d, --discovery<token,discoveryMessage>', 'send discovery message by device')
  .command('getappcli')
  .action(() => {
    let args = process.argv;
    switch (args[3]) {
      case "-l":
        // args[4] need to be user name
        // args[5] need to be password
        loginHandler(args[4], args[5])
        break;
      case "-u":
        // args[4] need to be the path of upload's details file;
        // args[5] need to be the path of zip file of manifest upload;
        // args[6] need to be the upload's token of manifest upload;
        sendUploadMessage(args[4], args[5], args[6])
        break;
      case "-d":
        // args[4] need to be the path of upload's details file;
        sendDiscoveryMessage(args[4]);
        break;

      default:
        break;
    }
  });

program.parse(process.argv)
// console.log( program.parse(process.argv))
// // function SendUploadMessage(filePath, accessToken) {
// //   let jsonData
// //   readFile(filePath, 'utf-8', (err, dataFile) => {
// //     if (err) throw err;
// //     dataFile.accessToken = accessToken;
// //     jsonData = JSON.parse(dataFile);

// //     data = jsonData;
// //     console.log("Data Json:: ")
// //     console.log(data);
// //     const config = {
// //       headers: {
// //         'Authorization': `Bearer ${accessToken}`
// //       }
// //     };
// //     post('http://getapp-dev.getapp.sh:3000/api/upload/artifact', data, config)
// //       .then(response => {
// //         console.log(response.data);

// //       })
// //       .catch(error => {
// //         console.log(error);
// //       });
// //   });

// // }
// function SendUploadMessage(filePath, accessToken, zipFolder) {
//   let jsonData
//   console.log(uploadManifest);
//   //const data = GetDiscoveryData();
//   readFile(filePath, 'utf-8', (err, dataFile) => {
//     if (err) throw err;
//     //console.log(dataFile);
//     dataFile.accessToken = accessToken;
//     jsonData = JSON.parse(dataFile);
//     //console.log(jsonData);

//     data = jsonData;
//     console.log(data);
//     const config = {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     };
//     //console.log(data);
//     post('http://getapp-dev.getapp.sh:3000/api/upload/manifest', data, config)
//       .then(response => {
//         console.log(response.data);

//       })
//       .catch(error => {
//         console.log(error);
//       });
//   });

// }
// function SendDiscoveryMessage(filePath, accessToken) {
//   let jsonData;

//   //const data = GetDiscoveryData();
//   readFile(filePath, 'utf-8', (err, dataFile) => {
//     if (err) throw err;
//     //console.log(dataFile);
//     jsonData = JSON.parse(dataFile);
//     //console.log(jsonData);
//     data = jsonData;
//     console.log(data);
//     const config = {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     };
//     //console.log(data);
//     post('http://getapp-dev.getapp.sh:3000/api/discovery', data, config)
//       .then(response => {
//         console.log(response.data);

//       })
//       .catch(error => {
//         console.log(error);
//       });
//   });

// }
// function sendLogin(data) {
//   console.log(data);
//   console.log(login);
//   post('http://getapp-dev.getapp.sh:3000/api/login', data)
//     .then(response => {
//       console.log(response.data);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }


// init()