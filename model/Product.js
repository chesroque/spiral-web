const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	name: String,
	description: String,
	image: {
		data: Buffer,
		contentType: String,
	},
	createdBy: String,
	price: Number,
});

// export model user with UserSchema
module.exports = mongoose.model('Product', ProductSchema);
