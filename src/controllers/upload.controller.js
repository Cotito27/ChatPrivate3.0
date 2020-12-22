const ctrl = {};
const path = require('path');
const uuid = require('uuid');
const fs = require('fs-extra');
let { filesPayload } = require('../variables');

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

ctrl.removeFile = async (req, res) => {
  const idFile = req.params.id;
  await fs.unlink(path.resolve(`src/public/upload/${idFile}`));
  res.send('File actualized');
}

module.exports = ctrl;