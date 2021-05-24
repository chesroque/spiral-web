const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: '../public/images/' });

const {
	insertProduct,
	renderProductById,
	insertComment,
} = require('../controller/productController.js');

router.post('/', upload.single('image'), insertProduct);

router.get('/:productId', renderProductById);

router.post('/comment/:productId', insertComment);

module.exports = router;
