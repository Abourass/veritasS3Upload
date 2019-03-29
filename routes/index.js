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
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.post('/uploadFile/', (req, res, next) => {
  upload(req, res, err => { res.send('Success'); });
});

router.post('/upload', [upload.single('photo'), function(req, res, next) {
	if (err) {res.send(err)}
	res.send('Successfully uploaded files!');
}])

module.exports = router;
