const fs = require('fs');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const { fromPath } = require('pdf2pic');
const Jimp = require('jimp');

const certUploadHelper = async (userId, year, courseName, file) => {
  let uploadFile;

  //clean file name
  const cleanFileName = file.originalname.replace(/ /g, '-');
  const midName = cleanFileName.split('.').shift();
  const newFileName =
    userId +
    '-' +
    year +
    '-' +
    midName +
    '-' +
    Date.now() +
    path.extname(cleanFileName);

  //setup GFS storage function for certificate
  const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: () => {
      return {
        filename: userId + '-' + year + '.jpg',
        metadata: {
          userId,
          courseName,
          year,
        },
        bucketName: 'uploads',
      };
    },
  });

  const ext = path.extname(newFileName);

  //setup pdf2pic options
  const options = {
    density: 100,
    quality: 60,
    saveFilename: `${newFileName}`,
    savePath: `./uploads`,
    format: 'jpg',
  };

  //if PDF, convert and compress file
  if (ext === '.pdf') {
    const storeAsImage = fromPath(file.path, options);
    const pageToConvertAsImage = 1;

    await storeAsImage(pageToConvertAsImage).then((resolve) => {
      uploadFile = resolve;
      return uploadFile;
    });
  }

  //if png, jpeg or jpg, convert to jpg and compress
  if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
    await Jimp.read(file.path)
      .then((image) => {
        image
          .resize(Jimp.AUTO, 512)
          .quality(60)
          .write(`./uploads/${newFileName}.jpg`);
        uploadFile = image;
      })
      .catch((err) => console.log(err));
  }

  return { uploadFile, storage, newFileName };
};

module.exports = { certUploadHelper };
