const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
  secretAccessKey: process.env.AWS_S3_Secret_Access_Key,
  accessKeyId: process.env.AWS_S3_Access_Key_ID,
  region: 'us-west-1',
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'asset.bucket',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.post('/uploadFile/', (req, res, next) => {
  upload(req, res, err => { res.send('Success'); });
});

/*
  if (Object.keys(req.files).length !== 0) {
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // Use the mv() method to place the file somewhere on your server
    req.files.license.mv(`../AssetVal_Boot/data/reo/${req.user.id}/license.pdf`, err => {
      if (err) { return res.status(500).send(err); }
      req.flash('success_msg', 'File Successfully Uploaded');
      res.redirect('../licenseProfile');
    });
  } else {
    req.flash('error_msg', ' No files were uploaded.');
    return res.status(400).send('No files were uploaded.');
  }
});
*/
module.exports = router;
