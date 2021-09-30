const fs = require('fs');
const Cert = require('../models/Cert');
const aws = require('aws-sdk');
const { fromPath } = require('pdf2pic');
//import { fromPath } from 'pdf2pic';
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    POST Cert
//route   POST /api/cert/
//access  public
exports.postCert = asyncHandler(async (req, res, next) => {
  const certFile = req.file;
  let convertedCertFile;

  let certFileUrl;
  let certObj;

  console.log('certfile: ', certFile);

  const options = {
    density: 100,
    quality: 80,
    saveFilename: `${certFile.originalname}`,
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

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  const upload = (pic) => {
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(pic.path),
      Key: `cert/${pic.name}`,
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        res.json({ msg: err });
      }

      fs.unlinkSync(pic.path);
      fs.unlinkSync(certFile.path);
      //console.log('pic.path: ', pic.path);

      if (data) {
        certFileUrl = data.Location;
        console.log(
          'Certificate has been uploaded to S3 and URL created successfully'
        );

        certObj = await Cert.create({
          imgUrl: certFileUrl,
        });
        res.status(200).json({ success: true, data: certObj });
        return;
      }
    });
  };
  //upload(certFile);
  upload(convertedCertFile);
});

//desc    GET Cert by ID
//route   GET /api/cert/:id
//access  public

//desc    DELETE Cert by ID
//route   DELETE /api/cert/:id
//access  public
