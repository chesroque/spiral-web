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

	await product.save();

	res.redirect('back');
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
		products = await Product.find({}).lean();
	}

	if (req.user) {
		const newProducts = Promise.all(
			products.map(async (product) => {
				const cart = await User.find({ 'cart.productId': product._id }).lean();

				return { ...product, isInCart: Boolean(cart.length) };
			}),
		);

		return res.render('home', {
			title: 'Spiral',
			products: await newProducts,
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

	const product = await Product.findById(productId).lean();

	var total = 0;

	if (product.comments[0]) {
		const commentsWithUsername = await Promise.all(
			product.comments.map(async (comment) => {
				const username = await User.findOne({ _id: comment.createdBy });

				total += comment.rating;
				return { ...comment, username: username.name };
			}),
		);

		const tempProduct = {
			...product,
			comments: commentsWithUsername,
			average: total / product.comments.length,
		};

		return res.render('product', {
			product: tempProduct,
			isLogged: req.user !== undefined,
			productId: productId,
		});
	}

	res.render('product', {
		product: product,
		isLogged: req.user !== undefined,
		productId: productId,
	});
};

const insertComment = async (req, res) => {
	if (req.user === undefined) return res.redirect('/user/login');
	const { productId } = req.params;
	const { comment, rating } = req.body;

	console.log(comment);
	await Product.findByIdAndUpdate(productId, {
		$push: {
			comments: {
				content: comment,
				rating: rating,
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
