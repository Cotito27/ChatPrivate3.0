const ctrl = {};
const path = require('path');
const uuid = require('uuid');
const fs = require('fs-extra');
const fsNrm = require('fs');
const request = require('request');
let { filesPayload } = require('../variables');

let download = async function(uri, filename, callback){
  await request.head(uri, async function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    await request(uri).pipe(fsNrm.createWriteStream(filename)).on('close', callback);
  });
};

ctrl.createUrl = async (req, res) => {
  // let receivedSrc = JSON.parse(req.body.json).fileSrc;
  // req.session.fileSelected = receivedSrc;
  // filesPayload[req.user.user] = receivedSrc;
  // console.log(req.session);
  // res.send('Success');
  // res.send(req.body.json);
  const saveFile = async () => {
    const videoUrl = uuid.v4();
    const ext = path.extname(req.file.originalname).toLowerCase();
    let images = [];
    console.log(videoUrl);
      // Image Location
      const videoTempPath = req.file.path;
      const targetPath = path.resolve(`src/public/upload/${videoUrl}${ext}`);
 
      //console.log(videoTempPath, targetPath,'path');
      // Validate Extension
        // you wil need the public/temp path or this will throw an error

        await fs.rename(videoTempPath, targetPath);

        //res.redirect('/');
        res.send(`${videoUrl}${ext}`);
      // } else {
      //   await fs.unlink(videoTempPath);
      //   res.status(500).json({ error: 'Only Images are allowed' });
      // }
  };

  saveFile();
}

ctrl.downloadImgExtern = async(req, res) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  // res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  const urlReceived = JSON.parse(req.body.json).fileSrc.replace(/amp;/g, '');
  const ext = '.jpg';
  const fileUrl = uuid.v4();
  const newUrlDownload = path.resolve(`src/public/upload/${fileUrl}${ext}`);
  await download(urlReceived, newUrlDownload, function(){
    res.send(`/upload/${fileUrl}${ext}`);
  });
}

ctrl.removeFile = async (req, res) => {
  const idFile = req.params.id;
  await fs.unlink(path.resolve(`src/public/upload/${idFile}`));
  res.send('File actualized');
}

module.exports = ctrl;