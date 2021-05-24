const User = require('../model/User.js');

const signupUser = async (req, res) => {
	const { email, password, username, fname, lname } = req.body;

	const user = new User({
		username: email,
		name: username,
		fname: fname,
		lname: lname,
	});

	User.register(user, password, (error) => {
		if (error) res.json(error);
		else res.redirect('/profile/');
	});
};

const editUserDetails = async (req, res) => {
	if (req.user === undefined) return res.redirect('/user/login');

	const { username, fname, lname } = req.body;

	const query = await User.findByIdAndUpdate(req.user._id, {
		$set: {
			name: username,
			fname: fname,
			lname: lname,
		},
	});

	res.json(query);
};

const changePassword = async (req, res) => {
	if (req.user === undefined) return res.redirect('/login');

	const { oldPassword, newPassword, confirmNewPassword } = req.body;

	// if (newPassword !== confirmNewPassword)
	// 	return res.render('settings', { isNewPasswordNotSame: true, user: user });

	req.user.changePassword(oldPassword, newPassword, (error) => {
		if (error)
			return res.render('editprofile', { isOldPasswordIncorrect: true, user: req.user });

		res.redirect('/');
	});
};

module.exports = {
	signupUser,
	editUserDetails,
	changePassword,
};
