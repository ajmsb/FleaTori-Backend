const mongoose = require('mongoose');

const Advertisement = mongoose.model('Advertisement', {
	title: {
		type: String,
		minLength: 1,
		maxLength: 25,
		required: true
	},
	description: {
		type: String,
		minLength: 0,
		maxLength: 500,
		default: '',
		required: true
	},
	category: {
		type: String,
		minLength: 0,
		maxLength: 80,
		default: '',
		required: true
	},
	location: {
		type: String,
		minLength: 0,
		maxLength: 20,
		default: '',
		required: true
	},
	delivery: {
		type: Boolean,
		default: '',
		required: false
	},
	price: {
		type: Number,
		min: 0,
		default: 0,
		required: true
	},
	pictures: {
		type: Array,
		of: String,
		default: []
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = Advertisement;
