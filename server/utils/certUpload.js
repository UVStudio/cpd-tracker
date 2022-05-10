const path = require('path');
const { fromPath } = require('pdf2pic');

const certUploadHelper = async (userId, year, file) => {
  let uploadFile;

  //clean file name
  const cleanFileName = file.originalname.replace(/ /g, '-');
  const midName = cleanFileName.split('.').shift();
  const newFileName =
    // userId +
    // '-' +
    year + '-' + midName + '-' + Date.now() + path.extname(cleanFileName);

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
  if (ext === '.pdf' || ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
    const storeAsImage = fromPath(file.path, options);
    const pageToConvertAsImage = 1;

    await storeAsImage(pageToConvertAsImage).then((resolve) => {
      uploadFile = resolve;
      return uploadFile;
    });
  } else {
    return next(
      new ErrorResponse(
        'Please upload an image file in one of the following formats: .pdf, .png, .jpeg or .jpg.',
        400
      )
    );
  }

  return { uploadFile, newFileName };
};

module.exports = { certUploadHelper };

//Jimp code to compress non pdf's but looks like pdf2pic is doing the job
//if png, jpeg or jpg, convert to jpg and compress
// if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
//   console.log('certUpload jpg hit');
//   await Jimp.read(file.path)
//     .then((image) => {
//       image
//         .resize(Jimp.AUTO, 512)
//         .quality(60)
//         .write(`./uploads/${newFileName}.jpg`);
//       uploadFile = image;
//     })
//     .catch((err) => console.log('jimp error: ', err));
// }
