const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: '../public/images/' });

const { insertProduct } = require('../controller/productController.js');

router.post('/', upload.single('image'), insertProduct);

module.exports = router;
