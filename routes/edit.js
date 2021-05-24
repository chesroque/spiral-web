var express = require('express');
var router = express.Router();

const { editUserDetails, changePassword } = require('../controller/userController');

router.get('/', function (req, res, next) {
	if (req.user === undefined) return res.redirect('/user/login');

	res.render('editprofile', {
		title: 'Spiral',
		isLogged: req.user !== undefined,
		user: req.user,
	});
});

router.post('/info', editUserDetails);

router.post('/password', changePassword);

module.exports = router;
