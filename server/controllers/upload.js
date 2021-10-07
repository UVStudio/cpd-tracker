const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { fromPath } = require('pdf2pic');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { GridFsStorage } = require('multer-gridfs-storage');

//@route   POST /api/upload
//@desc    Uploads file to DB
//@access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const userId = req.user.id;
  const year = req.body.year;

  if (!file || !year) {
    return next(new ErrorResponse('Complete the form.', 400));
  }

  let uploadFile;

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

  const options = {
    density: 100,
    quality: 60,
    saveFilename: `${newFileName}`,
    savePath: `./uploads`,
    format: 'jpg',
  };

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

  //https://www.npmjs.com/package/sharp
  //https://www.npmjs.com/package/png-to-jpeg
  //https://www.npmjs.com/package/jimp

  const stream = fs.createReadStream(uploadFile.path);
  const response = await storage.fromStream(stream, req, uploadFile);

  fs.unlinkSync(file.path);
  fs.unlinkSync(uploadFile.path);

  const certObj = await Cert.create({
    user: userId,
    img: response.id,
    year,
  });

  res
    .status(200)
    .json({ success: 'true', fileData: response, certData: certObj });
});
