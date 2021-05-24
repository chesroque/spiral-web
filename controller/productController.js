const Product = require('../model/Product.js');
const fs = require('fs');
const User = require('../model/User.js');

const insertProduct = async (req, res) => {
	const { name, description, price } = req.body;

	if (req.user === undefined) res.redirect('/user/login');

	if (req.file) {
		const product = new Product({
			name: name,
			description: description,
			price: price,
			image: {
				data: fs.readFileSync(req.file.path).toString('base64'),
				contentType: req.file.mimetype,
			},
			createdBy: req.user.name,
		});

		const query = await product.save();

		return res.json(query);
	}

	const product = new Product({
		name: name,
		price: price,
		createdBy: req.user.name,
	});

	const query = await product.save();

	res.json(query);
};

const renderProducts = async (req, res) => {
	var products = {};

	if (req.query.search) {
		products = await Product.find({
			$or: [
				{ name: { $regex: new RegExp(`\\b(${req.query.search})\\b`), $options: 'i' } },
				{
					description: {
						$regex: new RegExp(`\\b(${req.query.search})\\b`),
						$options: 'i',
					},
				},
			],
		});
	} else {
		products = await Product.find({});
	}

	if (req.user) {
		const newPost = Promise.all(
			products.map(async (product) => {
				const cart = await User.find({ 'cart.productId': product._id }).lean();

				return { ...product, isInCart: Boolean(cart.length) };
			}),
		);

		return res.render('home', {
			title: 'Spiral',
			products: await newPost,
			isLogged: req.user !== undefined,
			search: req.query.search,
		});
	}

	res.render('home', {
		title: 'Spiral',
		products: products,
		isLogged: req.user !== undefined,
		search: req.query.search,
	});
};

const renderProductById = async (req, res) => {
	const { productId } = req.params;

	const product = await Product.findById(productId);

	res.render('product', {
		product: product,
		isLogged: req.user !== undefined,
		productId: productId,
	});
};

const insertComment = async (req, res) => {
	const { productId } = req.params;
	const { comment } = req.body;

	console.log(comment);
	const query = await Product.findByIdAndUpdate(productId, {
		$push: {
			comments: {
				content: comment,
				createdBy: req.user._id,
				date: Date.now(),
			},
		},
	});

	res.redirect('back');
};

module.exports = {
	insertProduct,
	renderProducts,
	renderProductById,
	insertComment,
};
