const ctrl = {};

const { randomNumber } = require('../helpers/libs');
const User = require('../models/User.model');
const path = require('path');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fotoDefault = '/img/avatar-login3.png';

ctrl.create = async (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const images = await User.find({ foto: `/upload/${imgUrl}${ext}` });
    // console.log(images);
    if (images.length > 0) {
      saveImage();
    } else {
      // Image Location
      const imageTempPath = req.file.path;
      // console.log(req.body);
      // Remove previous image
      const dataPrevious = await User.findOne({ _id: req.user.id });
      // console.log(dataPrevious);
      if(dataPrevious) {
        const imagePrevious =  dataPrevious.foto;
        await fs.unlink(path.resolve(`src/public/${imagePrevious}`)).then().catch((err) => console.log(err));
      }
      

      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
      console.log(imageTempPath, targetPath,'path');
      // Validate Extension
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        // you wil need the public/temp path or this will throw an error
        await fs.rename(imageTempPath, targetPath);
        // const newImg = new Image({
        //   title: req.body.title,
        //   filename: imgUrl + ext,
        //   description: req.body.description
        // });
        // const imageSaved = await newImg.save();
        const urlPathImage = imgUrl + ext;
        // console.log(urlPathImage);
        // console.log(req.user.id);
        
        await User.findByIdAndUpdate({ _id: req.user.id }, {
          $set: {
            foto: `/upload/${urlPathImage}`
          }
        })
        
        // req.session.foto = `/upload/${urlPathImage}`;
        req.user.foto = `/upload/${urlPathImage}`;
        res.send(`/upload/${urlPathImage}`);
        
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: 'Only Images are allowed' });
      }
    }
  };
  if(!req.file) {
    const dataPrevious = await User.findOne({ _id: req.user.id });
      // console.log(dataPrevious);
      if(dataPrevious) {
        if(dataPrevious.public_id) {
          await cloudinary.v2.uploader.destroy(dataPrevious.public_id);
        }
      } 
    await User.findByIdAndUpdate({ _id: req.user.id }, {
      $set: {
        foto: fotoDefault,
        public_id: null
      }
    });
    res.send(fotoDefault);
    return;
  }
  const dataPrevious = await User.findOne({ _id: req.user.id }).catch((err) => {
    console.log(err,'Error de Busqueda');
  });

      // console.log(dataPrevious);
      if(dataPrevious) {
        if(dataPrevious.public_id) {
          await cloudinary.v2.uploader.destroy(dataPrevious.public_id);
        }
        
      }
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await User.findByIdAndUpdate({ _id: req.user.id }, {
        $set: {
          foto: result.url,
          public_id: result.public_id
        }
  }).catch((err) => console.log(err));

  await fs.unlink(req.file.path);
  req.user.foto = result.url;
  console.log(result.url);
  res.send(result.url);
  // saveImage();
}

module.exports = ctrl;