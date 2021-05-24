var express = require('express');
var router = express.Router();

const Post = require('../model/Product');

router.get('/', async (req, res) => {
	if (req.user === undefined) return res.redirect('/user/login');

	var total = 0;
	const cart = await Promise.all(
		req.user.cart.map(async (product) => {
			const query = await Post.findById(product.productId);
			console.log(query);

			if (query.price) total += query.price;
			return query;
		}),
	);
	console.log(cart);

	res.render('checkout', {
		title: 'Spiral',
		cart: cart,
		inCart: cart.length,
		total: total,
	});
});

router.post('/', function (req, res, next) {});

module.exports = router;
