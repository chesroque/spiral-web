const Product = require('../model/Product');
const User = require('../model/User.js');

const renderProfileByUsername = async (req, res) => {
	const { username } = req.params;
	const userProducts = await Product.find({ createdBy: username });
	const user = await User.findOne({ name: username }).lean();

	return res.render('profile', {
		products: userProducts,
		isLogged: req.user !== undefined,
		username: user.name,
	});
};

const renderProfile = async (req, res) => {
	if (req.user === undefined) return res.redirect('/user/login');

	res.redirect(`/profile/${req.user.name}`);
};

const addToCart = async (req, res) => {
	if (req.user === undefined) return res.redirect('/user/login');

	const { _id } = req.user;
	const { productId } = req.params;

	await User.findByIdAndUpdate(_id, {
		$push: { cart: { productId: productId } },
	});

	res.redirect('back');
};

const cartRemove = async (req, res) => {
	const { productId } = req.params;

	const query = await User.findByIdAndUpdate(req.user._id, {
		$pull: { cart: { productId: productId } },
	});

	res.json(query);
};

module.exports = {
	renderProfileByUsername,
	renderProfile,
	addToCart,
	cartRemove,
};
