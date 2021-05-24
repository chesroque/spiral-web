const express = require('express');
const passport = require('passport');
const router = express.Router();

const { signupUser } = require('../controller/userController');
const { addToCart, cartRemove } = require('../controller/profileController');

router.get('/login', (req, res) => {
	if (req.user) return res.redirect('/');

	if (req.session.messages) {
		return res.render('login', { isLoginFailed: req.session.messages['0'] == '101' });
	}

	return res.render('login');
});

router.get('/signup', (req, res) => {
	return res.render('signup');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: `/profile/`,
		successMesage: 'success',
		failureRedirect: '/user/login',
		failureMessage: '101',
	}),
);

router.post('/signup', signupUser);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.post('/addToCart/:productId', addToCart);

router.post('/cartRemove/:productId', cartRemove);

router.post('/profilePicture', cartRemove);

module.exports = router;
