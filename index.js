const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const downloadURL = "https://api.dsotools.com/api/upload"
try {
  const filePath = core.getInput('file');
  const saveDir = core.getInput('outputPath')
  console.log(`File Path: ${filePath}!`);

  uploadFile(filePath,saveDir + "/response.bicep")

  const time = (new Date()).toTimeString();
  core.setOutput("filePath", time);

} catch (error) {
  core.setFailed(error.message);
}



async function uploadFile(uploadedFile, saveFile) {
    return new Promise(async (fulfill, reject) => {
        const uploadFile = fs.createReadStream(uploadedFile);
        const form = new FormData();
        form.append('file', uploadFile);


        let stream = fs.createWriteStream(saveFile);
        let response = await axios.post(downloadURL, form, { responseType: 'stream',   headers: {...form.getHeaders()} });
        
        if (response.status === 200) {
            response.data.pipe(stream);
            stream.on('finish', fulfill);
            stream.on('error', reject); // presumably
        }
    });
}