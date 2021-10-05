const fs = require('fs');
const Cert = require('../models/Cert');
const User = require('../models/User');
const aws = require('aws-sdk');
const { fromPath } = require('pdf2pic');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//Avoid uploading duplicates onto MongoDB

//desc    POST Cert
//route   POST /api/cert/
//access  private
exports.postCert = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const certFile = req.file;
  const year = req.body.year;
  let convertedCertFile;

  let certFileUrl;
  let certObj;
  let convertSwitch = true;

  // console.log('userId: ', userId);
  // console.log('certfile: ', certFile);
  // console.log('certfile original name: ', certFile.originalname);

  const certFileOrigName = certFile.originalname;
  const certFileConvertedName = certFileOrigName.replace(/ /g, '-');

  //console.log('new converted name: ', certFileConvertedName);

  const fileExtLength = certFileConvertedName.split('.').length;
  const fileExt = certFileConvertedName.split('.')[fileExtLength - 1];

  //console.log('fileExt: ', fileExt);

  if (fileExt !== 'pdf') {
    convertSwitch === false;
  }

  //if cert is PDF, convert to jpg
  if (convertSwitch) {
    const options = {
      density: 100,
      quality: 60,
      saveFilename: `${certFileConvertedName}`,
      savePath: './uploads',
      format: 'jpg',
    };

    const storeAsImage = fromPath(certFile.path, options);
    const pageToConvertAsImage = 1;

    await storeAsImage(pageToConvertAsImage)
      .then((resolve) => {
        convertedCertFile = resolve;
        console.log('convertedCertFile: ', convertedCertFile);
        return convertedCertFile;
      })
      .catch(console.log('not working'));
  }

  //AWS S3 upload begins
  // aws.config.setPromisesDependency();
  // aws.config.update({
  //   accessKeyId: process.env.ACCESSKEYID,
  //   secretAccessKey: process.env.SECRETACCESSKEY,
  //   region: process.env.REGION,
  // });

  // const s3 = new aws.S3();

  // const upload = (cert) => {
  //   const params = {
  //     ACL: 'public-read',
  //     Bucket: process.env.BUCKET_NAME,
  //     Body: fs.createReadStream(cert.path),
  //     Key: `cert/${cert.name}`,
  //   };

  //   s3.upload(params, async (err, data) => {
  //     if (err) {
  //       res.json({ msg: err });
  //     }

  //     fs.unlinkSync(cert.path);
  //     fs.unlinkSync(certFile.path);

  //     if (data) {
  //       certFileUrl = data.Location;
  //       console.log(
  //         'Certificate has been uploaded to S3 and URL created successfully'
  //       );

  //       certObj = await Cert.create({
  //         user: userId,
  //         imgUrl: certFileUrl,
  //         year,
  //       });

  //       res.status(200).json({ success: true, data: certObj });
  //       return;
  //     }
  //   });
  // };

  //code to decide whether to upload .pdf or .jpg
  if (convertSwitch) {
    upload(convertedCertFile);
  } else {
    upload(certFile);
  }
});

//desc    GET Cert by ID
//route   GET /api/cert/:id
//access  public
exports.getCertById = asyncHandler(async (req, res, next) => {
  const cert = await Cert.findById(req.params.id);

  if (!cert) {
    return next(new ErrorResponse('This certificate does not exist.', 400));
  }

  res.status(200).json({ success: true, data: cert });
});

//desc    DELETE Cert by ID
//route   DELETE /api/cert/:id
//access  public
exports.deleteCertById = asyncHandler(async (req, res, next) => {
  const cert = await Cert.findById(req.params.id);

  if (!cert) {
    return next(new ErrorResponse('This certificate does not exist.', 400));
  }

  const certPic = 'cert/' + cert.imgUrl.split('/').pop();

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Key: certPic,
  };

  const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    Bucket: process.env.BUCKET_NAME,
    region: process.env.REGION,
  });

  await s3
    .deleteObject(deleteParam, (err, data) => {
      if (err) console.error('err: ', err);
      if (data) console.log('data:', data);
    })
    .promise();

  await Cert.deleteOne({ _id: req.params.id });

  res.status(200).json({ success: 'true', data: 'Certificate deleted.' });
});

//desc    DELETE all Certs img on S3
//route   DELETE /api/cert/
//access  public
exports.deleteAllCerts = asyncHandler(async (req, res, next) => {
  const certs = await Cert.find();

  const objects = certs.map((cert) => ({
    Key: 'cert/' + cert.imgUrl.split('/').pop(),
  }));

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Delete: { Objects: objects },
  };

  const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    Bucket: process.env.BUCKET_NAME,
    region: process.env.REGION,
  });

  await s3
    .deleteObjects(deleteParam, (err, data) => {
      if (err) console.error('err: ', err);
      if (data) console.log('data:', data);
    })
    .promise();

  await Cert.deleteMany();

  res.status(200).json({
    success: 'true',
    data: { 'certificates deleted: ': certs.length },
  });
});
