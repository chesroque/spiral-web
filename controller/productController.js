const Product = require('../model/Product.js');
const fs = require('fs');

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
	const posts = await Product.find({});

	res.render('home', { title: 'Spiral', posts: posts, isLogged: req.user !== undefined });
};

module.exports = {
	insertProduct,
	renderProducts,
};
