const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

try {
  const filePath = core.getInput('file');
  const saveDir = core.getInput('outputPath')
  console.log(`File Path: ${filePath}!`);

  const upload = async () => {
    try {
      const file = fs.createReadStream(filePath);
//      const title = 'My file';
    
      const form = new FormData();
  //    form.append('title', title);
      form.append('file', filePath);
    
      const resp = await axios.post('http://api.dsotools.com/api/upload', form, {
        headers: {
          ...form.getHeaders(),
        }
      });
    
      if (resp.status === 200) {
        const path = `${__dirname}/files/img.jpeg`; 
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish',() => {
            filePath.close();
            console.log('Download Completed'); 
        })
      } 
    } catch(err) {
      return new Error(err.message);
    }
  }

  upload().then(resp => console.log(resp));

  const time = (new Date()).toTimeString();
  core.setOutput("filePath", time);

} catch (error) {
  core.setFailed(error.message);
}