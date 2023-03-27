const { program } = require('commander');
const loginMessage = require('./login');
const uploadMessage = require('./upload');
const axios = require('axios');
const readline = require('readline');
const fs = require('fs');


program

  .option('-l, --login <user>', 'login with user and password')
  .option('-u, --upload <token,version>', 'upload new version message')
  .option('-d,--discovery<token,discoveryMessage>', 'send discovery message by device')
  .command('getappcli')
  .action(() => {
    args = process.argv;
    console.log(args[3]);
    if (args[3]=="-l")
        {

          const data = {
            username: args[4],
            password: args[5]
          };
          sendLogin(data);
            console.log(`login`);
        }
    if (args[3]=="-u")
        {
          const accessToken = args[5];
          const filePath = args[4];
        //const filePath = '/Users/ronnytzur/newdir/UploadData.json';
        
          SendUploadMessage(filePath,accessToken);

                      //uploadMessage('rqwyuetuiqwhriqwheug42hu8he281b8b84');
            console.log(`upload`);
        }   
    if(args[3] == "-d")
      { 
        const accessToken = args[5];
        const filePath = args[4];
        SendDiscoveryMessage(filePath,accessToken);

      }
    });
program.parse(process.argv)
function SendUploadMessage(filePath, accessToken)
{
  let jsonData
 fs.readFile( filePath, 'utf-8', (err, dataFile) => {
  if (err) throw err;
  dataFile.accessToken=accessToken;
  jsonData = JSON.parse(dataFile);
  
  data = jsonData;
  console.log("Data Json:: ")
  console.log(data);
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  axios.post('http://getapp-dev.getapp.sh:3000/api/upload/artifact',data,config)
    .then(response => {
      console.log(response.data);
    
    })
    .catch(error => {
      console.log(error);
    });
});

}
function SendUploadMessage(filePath, accessToken,zipFolder)
{
  let jsonData
console.log(uploadManifest);
  //const data = GetDiscoveryData();
 fs.readFile( filePath, 'utf-8', (err, dataFile) => {
  if (err) throw err;
 //console.log(dataFile);
  dataFile.accessToken=accessToken;
   jsonData = JSON.parse(dataFile);
  //console.log(jsonData);
  
  data = jsonData;
  console.log(data);
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  //console.log(data);
  axios.post('http://getapp-dev.getapp.sh:3000/api/upload/manifest',data,config)
    .then(response => {
      console.log(response.data);
    
    })
    .catch(error => {
      console.log(error);
    });
});

}
function SendDiscoveryMessage(filePath, accessToken)
{
  let jsonData;

  //const data = GetDiscoveryData();
 fs.readFile( filePath, 'utf-8', (err, dataFile) => {
  if (err) throw err;
 //console.log(dataFile);
   jsonData = JSON.parse(dataFile);
  //console.log(jsonData);
  data = jsonData;
  console.log(data);
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  //console.log(data);
  axios.post('http://getapp-dev.getapp.sh:3000/api/discovery',data,config)
    .then(response => {
      console.log(response.data);
    
    })
    .catch(error => {
      console.log(error);
    });
});

}
function sendLogin(data)
{
  console.log(data);
  console.log(login);
  axios.post('http://getapp-dev.getapp.sh:3000/api/login', data)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
}


