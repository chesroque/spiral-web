var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';
const auth = require('../middleware/auth');

router.get('/', auth, function (req, res, next) {
	res.render('editprofile', {
		title: 'Spiral',
		home: 'Home',
		profile: 'Profile',
		signout: 'Sign out',
	});
});

router.post('/', function (req, res, next) {
	MongoClient.connect('mongodb://localhost:27017', function (err, client) {
		let db = client.db('spiral2');
		const query = { username: req.body.username };
		console.log(query);
		var post = req.body;
		// Set some fields in that document
		const update = {
			$set: {
				username: req.body.username,
				fname: req.body.fname,
				lname: req.body.lname,
				email: req.body.email,
			},
		};
		// Return the updated document instead of the original document
		const options = { returnNewDocument: true };
		return db
			.collection('users')
			.findOneAndUpdate(query, update, options)
			.then((updatedDocument) => {
				console.log('UPDATED DOC = ', updatedDocument);

				if (updatedDocument) {
					console.log(`Successfully updated document: ${updatedDocument}.`);
					console.log(update);
				} else {
					console.log('No document matches the provided query.');
				}
				return updatedDocument;
			})
			.catch((err) => console.error(`Failed to find and update document: ${err}`));
	});
});

module.exports = router;
