const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { fromPath } = require('pdf2pic');
const Jimp = require('jimp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { GridFsStorage } = require('multer-gridfs-storage');

//@route   POST /api/upload
//@desc    Uploads Cert to DB
//@access  Private
exports.uploadCert = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const userId = req.user.id;
  const year = req.body.year;

  let uploadFile;

  if (!file || !year) {
    return next(new ErrorResponse('Complete the form.', 400));
  }

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
        bucketName: 'uploads',
      };
    },
  });

  const ext = path.extname(newFileName);

  //setup pdf2jpg options
  const options = {
    density: 100,
    quality: 60,
    saveFilename: `${newFileName}`,
    savePath: `./uploads`,
    format: 'jpg',
  };

  //convert file if PDF
  if (ext === '.pdf') {
    const storeAsImage = fromPath(file.path, options);
    const pageToConvertAsImage = 1;

    await storeAsImage(pageToConvertAsImage)
      .then((resolve) => {
        uploadFile = resolve;
        return uploadFile;
      })
      .catch(console.log('not working'));
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

  //Jimp object does not have path. Must pass path string directly
  const stream = fs.createReadStream(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );
  const response = await storage.fromStream(stream, req, uploadFile);

  fs.unlinkSync(file.path);
  fs.unlinkSync(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  //upload file to MongoDB, uploadFile is the file object to upload
  const certObj = await Cert.create({
    user: userId,
    img: response.id,
    year,
  });

  res
    .status(200)
    .json({ success: 'true', fileData: response, certData: certObj });
});

//** https://www.npmjs.com/package/jimp **//
//https://www.npmjs.com/package/sharp
//https://www.npmjs.com/package/png-to-jpeg
