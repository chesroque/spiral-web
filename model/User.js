
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	fname: {
		type: String,
		required: true,
	},
	lname: {
		type: String,
		required: true,
	},
	photo: {
		data: Buffer,
		contentType: String,
	},
	name: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	cart: [{ productId: String }],
});

UserSchema.plugin(passportLocalMongoose);

// export model user with UserSchema
module.exports = mongoose.model('User', UserSchema);