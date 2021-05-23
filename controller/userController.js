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
		else res.redirect('/profile');
	});
};

module.exports = {
	signupUser,
};
