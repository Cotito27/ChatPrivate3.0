const ctrl = {};
const path = require('path');
const uuid = require('uuid');
const fs = require('fs-extra');

ctrl.create = (req, res) => {
  console.log('Subiendo Audio');
  const saveAudio = async () => {
    const videoUrl = uuid.v4();
    let images = [];
    console.log(videoUrl);
      // Image Location
      const videoTempPath = req.file.path;
      const ext = '.webm';
      const targetPath = path.resolve(`src/public/upload/${videoUrl}${ext}`);
 
      //console.log(videoTempPath, targetPath,'path');
      // Validate Extension
      if (ext === '.mp3' || ext === '.ogg' || ext === '.mp4' || ext === '.webm') {
        // you wil need the public/temp path or this will throw an error

        await fs.rename(videoTempPath, targetPath);

        //res.redirect('/');
        res.send(`${videoUrl}${ext}`);
      } else {
        await fs.unlink(videoTempPath);
        res.status(500).json({ error: 'Only Images are allowed' });
      }
  };

  saveAudio();
}

module.exports = ctrl;