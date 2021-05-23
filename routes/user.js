const express = require('express');
const passport = require('passport');
const router = express.Router();

const { signupUser } = require('../controller/userController');
const { addToCart } = require('../controller/profileController');

router.get('/login', (req, res) => {
	if (req.user) return res.redirect('/');
	return res.render('login');
});

router.get('/signup', (req, res) => {
	return res.render('signup');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: `/profile/}`,
		successMesage: 'success',
		failureMessage: '101',
	}),
);

router.post('/signup', signupUser);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('back');
});

router.post('/addToCart/:productId', addToCart);

module.exports = router;
