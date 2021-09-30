const express = require('express');
const multer = require('multer');

const { postCert } = require('../controllers/cert');

const router = express.Router();

const multerSingle = multer({
  dest: 'uploads/',
  //limits: { fieldSize: 300 * 300 },
}).single('cert');

router.post('/', multerSingle, postCert);

module.exports = router;
