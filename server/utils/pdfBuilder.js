const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const aws = require('aws-sdk');

//create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfsCerts;

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfsCerts = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

const pageBreakers = [8, 18, 28, 38, 48, 58, 68, 78, 88, 98];

const pageBreakFn = (num) => {
  return pageBreakers.find((breaker) => breaker === num);
};

const buildPDF = async (
  res,
  conn,
  userId,
  year,
  user,
  searchTerm,
  CPDFileName,
  downloadFile
) => {
  const doc = new PDFDocument();

  //Text styling
  const titleSize = 16;
  const subTitleSize = 14;
  const textSize = 12;
  const avenirBold = './fonts/AvenirNextCondensed-Bold.ttf';
  const avenirDemiBold = './fonts/AvenirNextCondensed-DemiBold.ttf';
  const avenirMedium = './fonts/AvenirNextCondensed-Medium.ttf';

  //End doc text
  const endDocText = 'This is the end of the CPD Report';

  //user CPD recors
  const userHours = user.hours;
  const chosenYear = userHours[0];
  const prevYear = userHours[1];
  const twoYearsAgo = userHours[2];

  const chosenYearVer = chosenYear.verifiable;
  const chosenYearNonVer = chosenYear.nonVerifiable;
  const chosenYearEthics = chosenYear.ethics;
  const chosenYearCPD = chosenYearVer + chosenYearNonVer;

  let prevYearSearchTerm, twoYearsAgoSearchTerm;
  let prevYearVer = 0;
  let prevYearNonVer = 0;
  let prevYearEthics = 0;
  let prevYearCPD = 0;
  let twoYearsAgoVer = 0;
  let twoYearsAgoNonVer = 0;
  let twoYearsAgoEthics = 0;
  let twoYearsAgoCPD = 0;

  if (prevYear) {
    prevYearSearchTerm = searchTerm
      .slice(0, -8)
      .concat(prevYear.year)
      .concat('.jpg');

    prevYearVer = prevYear.verifiable;
    prevYearNonVer = prevYear.nonVerifiable;
    prevYearEthics = prevYear.ethics;
    prevYearCPD = prevYearVer + prevYearNonVer;
  }

  if (twoYearsAgo) {
    twoYearsAgoSearchTerm = searchTerm
      .slice(0, -8)
      .concat(twoYearsAgo.year)
      .concat('.jpg');

    twoYearsAgoVer = twoYearsAgo.verifiable;
    twoYearsAgoNonVer = twoYearsAgo.nonVerifiable;
    twoYearsAgoEthics = twoYearsAgo.ethics;
    twoYearsAgoCPD = twoYearsAgoVer + twoYearsAgoNonVer;
  }

  const totalVer = chosenYearVer + prevYearVer + twoYearsAgoVer;
  const totalNonVer = chosenYearNonVer + prevYearNonVer + twoYearsAgoNonVer;
  const totalEthics = chosenYearEthics + prevYearEthics + twoYearsAgoEthics;
  const totalCPD = totalVer + totalNonVer;

  //pipe to temp upload folder
  let writeStream = fs.createWriteStream(`./uploads/${CPDFileName}`);
  doc.pipe(writeStream);

  //DOC PRINT BEGINS
  doc
    .image('./assets/accounting-icon.png', {
      fit: [50, 50],
    })
    .moveDown(1);

  //Doc Title
  doc.fontSize(titleSize).text('CPD Tracker').moveDown(0);
  doc.fontSize(textSize).text('By Sheriff Consulting').moveDown(2);
  doc.fontSize(subTitleSize).text(`CPA Name: ${user.name}`);
  doc
    .fontSize(textSize)
    .text(`CPD Report ${userHours[userHours.length - 1].year} - ${year}`)
    .moveDown(1.5);

  // 3 year rolling summary bolded, if 3 year rolling applies to user
  if (userHours.length === 3) {
    doc
      .fontSize(textSize)
      .font(avenirBold)
      .text(
        `3-Year Rolling Period ${twoYearsAgo.year} - ${year} CPD Hours Summary:`,
        {
          underline: true,
        }
      );
    doc
      .fontSize(textSize)
      .font(avenirBold)
      .text(`Verifiable Hours: ${totalVer}`);

    doc
      .fontSize(textSize)
      .font(avenirBold)
      .text(`Non-Verifiable Hours: ${totalNonVer}`);

    doc
      .fontSize(textSize)
      .font(avenirBold)
      .text(`Ethics Hours: ${totalEthics}`);

    doc
      .fontSize(textSize)
      .font(avenirBold)
      .text(`Total CPD Hours: ${totalCPD}`)
      .moveDown(1.5);
  }

  //chosen year summary
  doc.fontSize(textSize).font(avenirMedium).text(`${year} CPD Hours Summary:`, {
    underline: true,
  });

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Verifiable Hours: ${chosenYearVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Non-Verifiable Hours: ${chosenYearNonVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Ethics Hours: ${chosenYearEthics}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Total CPD Hours: ${chosenYearCPD}`)
    .moveDown(2);

  if (userHours.length === 1) {
    doc.addPage();
  }

  if (userHours.length >= 2) {
    //previous year summary
    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`${prevYear.year} CPD Hours Summary:`, {
        underline: true,
      });

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Verifiable Hours: ${prevYearVer}`);

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Non-Verifiable Hours: ${prevYearNonVer}`);

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Ethics Hours: ${prevYearEthics}`);

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Total CPD Hours: ${prevYearCPD}`)
      .moveDown(1.5);
  }
  if (userHours.length === 2) {
    doc.addPage();
  }

  //two years ago year summary
  if (userHours.length >= 3) {
    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`${twoYearsAgo.year} CPD Hours Summary:`, {
        underline: true,
      });

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Verifiable Hours: ${twoYearsAgoVer}`);

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Non-Verifiable Hours: ${twoYearsAgoNonVer}`);

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Ethics Hours: ${twoYearsAgoEthics}`);

    doc
      .fontSize(textSize)
      .font(avenirMedium)
      .text(`Total CPD Hours: ${twoYearsAgoCPD}`)
      .moveDown(1.5);

    doc.addPage();
  }

  //Chosen Year begins
  //Chosen Year CPD details
  doc
    .fontSize(titleSize)
    .font(avenirMedium)
    .text(`${chosenYear.year} CPD Details:`)
    .moveDown(0.5);

  doc
    .fontSize(subTitleSize)
    .font(avenirMedium)
    .text(`Verifiable Hours - ${chosenYear.year}:`, {
      underline: true,
    });

  doc
    .fontSize(subTitleSize)
    .font(avenirMedium)
    .text(`Total Verifiable Hours: ${chosenYearVer} hours earned`)
    .moveDown(0.5);

  //Chosen year verifiable courses and certs
  conn.db
    .collection('uploads.files')
    .find({
      filename: searchTerm,
    })
    .toArray(async (err, files) => {
      if (files.length === 0) {
        doc
          .fontSize(textSize)
          .font(avenirDemiBold)
          .text(`No certificates were uploaded for ${chosenYear.year}`);
        doc.addPage();
      }
      for (let i = 0; i < files.length; i++) {
        doc
          .fontSize(textSize)
          .font(avenirDemiBold)
          .text(`${i + 1} - ${files[i].metadata.courseName}`);
        doc
          .fontSize(textSize)
          .font(avenirMedium)
          .text(`Duration: ${files[i].metadata.hours} hour(s) earned`);
        doc
          .fontSize(textSize)
          .font(avenirMedium)
          .text(`Ethics Hour(s): ${files[i].metadata.ethicsHours}`)
          .moveDown(0.5);

        let tempCertFile = await downloadFile(files[i]._id, gfsCerts);

        doc
          .image(tempCertFile, {
            fit: [330, 220],
            align: 'center',
          })
          .moveDown(1);

        if (i === 1 || i % 2 === 1) {
          doc.addPage();
        }
      }

      //Chosen year's Non-Verifiable Summary
      doc
        .fontSize(subTitleSize)
        .font(avenirMedium)
        .text(`Non-Verifiable Hours - ${chosenYear.year}:`, {
          underline: true,
        });

      doc
        .fontSize(subTitleSize)
        .font(avenirMedium)
        .text(`Total Non-Verifiable Hours: ${chosenYearNonVer} hours earned`)
        .moveDown(0.5);

      //Chosen year's Non-Verifiable Details
      conn.db
        .collection('nonvers')
        .find({
          user: ObjectId(userId),
          year: chosenYear.year,
        })
        .toArray(async (err, files) => {
          if (files.length === 0) {
            doc
              .fontSize(textSize)
              .font(avenirDemiBold)
              .text(
                `No non-verifiable sessions were uploaded for ${chosenYear.year}`
              );
            doc.addPage();
          }
          for (let i = 0; i < files.length; i++) {
            doc
              .fontSize(textSize)
              .font(avenirDemiBold)
              .text(`${i + 1} - ${files[i].sessionName}`);
            doc
              .fontSize(textSize)
              .font(avenirMedium)
              .text(`Date: ${files[i].date}`);
            doc
              .fontSize(textSize)
              .font(avenirMedium)
              .text(`Duration: ${files[i].hours} hour(s) earned`)
              .moveDown(0.4);
            if (pageBreakFn(i) || i === files.length - 1) {
              doc.addPage();
            }
          }

          if (userHours.length === 1) {
            doc
              .fontSize(textSize)
              .font(avenirBold)
              .text(endDocText, { align: 'center' });
            doc.end();
          }

          //Previous Year begins
          if (userHours.length >= 2) {
            //Previous Year CPD details
            doc
              .fontSize(titleSize)
              .font(avenirMedium)
              .text(`${prevYear.year} CPD Details:`)
              .moveDown(0.5);

            doc
              .fontSize(subTitleSize)
              .font(avenirMedium)
              .text(`Verifiable Hours - ${prevYear.year}:`, {
                underline: true,
              });

            doc
              .fontSize(subTitleSize)
              .font(avenirMedium)
              .text(`Total Verifiable Hours: ${prevYearVer} hours earned`)
              .moveDown(0.5);

            //Previous year verifiable courses and certs
            conn.db
              .collection('uploads.files')
              .find({
                filename: prevYearSearchTerm,
              })
              .toArray(async (err, files) => {
                if (files.length === 0) {
                  doc
                    .fontSize(textSize)
                    .font(avenirDemiBold)
                    .text(`No certificates were uploaded for ${prevYear.year}`);
                  doc.addPage();
                }
                for (let i = 0; i < files.length; i++) {
                  doc
                    .fontSize(textSize)
                    .font(avenirDemiBold)
                    .text(`${i + 1} - ${files[i].metadata.courseName}`);
                  doc
                    .fontSize(textSize)
                    .font(avenirMedium)
                    .text(
                      `Duration: ${files[i].metadata.hours} hour(s) earned`
                    );
                  doc
                    .fontSize(textSize)
                    .font(avenirMedium)
                    .text(`Ethics Hour(s): ${files[i].metadata.ethicsHours}`)
                    .moveDown(0.5);

                  let tempCertFile = await downloadFile(files[i]._id, gfsCerts);

                  doc
                    .image(tempCertFile, {
                      fit: [330, 220],
                      align: 'center',
                    })
                    .moveDown(1);

                  if (i === 1 || i % 2 === 1) {
                    doc.addPage();
                  }
                }

                //Previous year's Non-Verifiable Summary
                doc
                  .fontSize(subTitleSize)
                  .font(avenirMedium)
                  .text(`Non-Verifiable Hours - ${prevYear.year}:`, {
                    underline: true,
                  });

                doc
                  .fontSize(subTitleSize)
                  .font(avenirMedium)
                  .text(
                    `Total Non-Verifiable Hours: ${prevYearNonVer} hours earned`
                  )
                  .moveDown(0.5);

                //Previous year's Non-Verifiable Details
                conn.db
                  .collection('nonvers')
                  .find({
                    user: ObjectId(userId),
                    year: prevYear.year,
                  })
                  .toArray(async (err, files) => {
                    if (files.length === 0) {
                      doc
                        .fontSize(textSize)
                        .font(avenirDemiBold)
                        .text(
                          `No non-verifiable sessions were uploaded for ${prevYear.year}`
                        );
                      doc.addPage();
                    }
                    for (let i = 0; i < files.length; i++) {
                      doc
                        .fontSize(textSize)
                        .font(avenirDemiBold)
                        .text(`${i + 1} - ${files[i].sessionName}`);
                      doc
                        .fontSize(textSize)
                        .font(avenirMedium)
                        .text(`Date: ${files[i].date}`);
                      doc
                        .fontSize(textSize)
                        .font(avenirMedium)
                        .text(`Duration: ${files[i].hours} hour(s) earned`)
                        .moveDown(0.4);
                      if (pageBreakFn(i) || i === files.length - 1) {
                        doc.addPage();
                      }
                    }

                    if (userHours.length === 2) {
                      doc
                        .fontSize(textSize)
                        .font(avenirBold)
                        .text(endDocText, { align: 'center' });
                      doc.end();
                    }

                    //Two Years ago begins
                    if (userHours.length >= 3) {
                      //Two years ago CPD details
                      doc
                        .fontSize(titleSize)
                        .font(avenirMedium)
                        .text(`${twoYearsAgo.year} CPD Details:`)
                        .moveDown(0.5);

                      doc
                        .fontSize(subTitleSize)
                        .font(avenirMedium)
                        .text(`Verifiable Hours - ${twoYearsAgo.year}:`, {
                          underline: true,
                        });

                      doc
                        .fontSize(subTitleSize)
                        .font(avenirMedium)
                        .text(
                          `Total Verifiable Hours: ${twoYearsAgoVer} hours earned`
                        )
                        .moveDown(0.5);

                      //Two years ago verifiable courses and certs
                      conn.db
                        .collection('uploads.files')
                        .find({
                          filename: twoYearsAgoSearchTerm,
                        })
                        .toArray(async (err, files) => {
                          if (files.length === 0) {
                            doc
                              .fontSize(textSize)
                              .font(avenirDemiBold)
                              .text(
                                `No certificates were uploaded for ${twoYearsAgo.year}`
                              );
                            doc.addPage();
                          }
                          for (let i = 0; i < files.length; i++) {
                            doc
                              .fontSize(textSize)
                              .font(avenirDemiBold)
                              .text(
                                `${i + 1} - ${files[i].metadata.courseName}`
                              );
                            doc
                              .fontSize(textSize)
                              .font(avenirMedium)
                              .text(
                                `Duration: ${files[i].metadata.hours} hour(s) earned`
                              );
                            doc
                              .fontSize(textSize)
                              .font(avenirMedium)
                              .text(
                                `Ethics Hour(s): ${files[i].metadata.ethicsHours}`
                              )
                              .moveDown(0.5);

                            let tempCertFile = await downloadFile(
                              files[i]._id,
                              gfsCerts
                            );

                            doc
                              .image(tempCertFile, {
                                fit: [330, 220],
                                align: 'center',
                              })
                              .moveDown(1);

                            if (i === 1 || i % 2 === 1) {
                              doc.addPage();
                            }
                          }
                          //Two years ago Non-Verifiable Summary
                          doc
                            .fontSize(subTitleSize)
                            .font(avenirMedium)
                            .text(
                              `Non-Verifiable Hours - ${twoYearsAgo.year}:`,
                              {
                                underline: true,
                              }
                            );

                          doc
                            .fontSize(subTitleSize)
                            .font(avenirMedium)
                            .text(
                              `Total Non-Verifiable Hours: ${twoYearsAgoNonVer} hours earned`
                            )
                            .moveDown(0.5);

                          //Two Years ago Non-Verifiable Details
                          conn.db
                            .collection('nonvers')
                            .find({
                              user: ObjectId(userId),
                              year: twoYearsAgo.year,
                            })
                            .toArray(async (err, files) => {
                              if (files.length === 0) {
                                doc
                                  .fontSize(textSize)
                                  .font(avenirDemiBold)
                                  .text(
                                    `No non-verifiable sessions were uploaded for ${twoYearsAgo.year}`
                                  );
                                doc.addPage();
                              }
                              for (let i = 0; i < files.length; i++) {
                                doc
                                  .fontSize(textSize)
                                  .font(avenirDemiBold)
                                  .text(`${i + 1} - ${files[i].sessionName}`);
                                doc
                                  .fontSize(textSize)
                                  .font(avenirMedium)
                                  .text(`Date: ${files[i].date}`);
                                doc
                                  .fontSize(textSize)
                                  .font(avenirMedium)
                                  .text(
                                    `Duration: ${files[i].hours} hour(s) earned`
                                  )
                                  .moveDown(0.4);
                                if (pageBreakFn(i) || i === files.length - 1) {
                                  doc.addPage();
                                }
                              }
                              doc
                                .fontSize(textSize)
                                .font(avenirBold)
                                .text(endDocText, { align: 'center' });
                              doc.end();
                            });
                        });
                    }
                  });
              });
          }
        });
    });

  //Stream to S3 and create the URL
  let reportFileUrl;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  writeStream.on('finish', () => {
    const pdfFile = fs.readFileSync(`./uploads/${CPDFileName}`);
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: pdfFile,
      Key: `reports/${CPDFileName}`,
      contentType: 'application/pdf',
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        res.json({ msg: err });
      }

      if (data) {
        reportFileUrl = data.Location;
        console.log(
          'Report has been uploaded to S3 and URL created successfully'
        );

        fs.unlinkSync(`./uploads/${CPDFileName}`);
        res.status(200).send({ success: true });
      }
    });
  });
};

module.exports = { buildPDF };
