var express = require('express');
var router = express.Router();

const {
	renderProfileByUsername,
	renderProfile,
} = require('../controller/profileController');

router.get('/', renderProfile);

router.get('/:username', renderProfileByUsername);

module.exports = router;
