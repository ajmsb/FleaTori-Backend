const mongoose = require('mongoose');

const User = mongoose.model('User', {
	email: {
		// so when we populate, we don't pass the email, only account
		type: String,
		minLength: 6,
		maxLength: 60,
		trim: true,
		required: true
	},
	salt: {
		type: String,
		// maxLength: 17,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	account: {
		username: {
			type: String,
			minLength: 3,
			maxLength: 60,
			required: true,
			trim: true
		},
		phone: {
			type: String,
			required: true,
			default: ''
		}
	}
});

module.exports = User;
