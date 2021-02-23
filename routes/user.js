const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');
const { v4: uuidv4 } = require('uuid');
const isAuthenticated = require('../middlewares/isAuthenticated');
const User = require('../models/user');
const Advertisement = require('../models/advertisement');
const generateToken = require('../middlewares/jwt');

//Register new User
router.post('/regUsers', async (req, res) => {
	try {
		const email = req.body.email;
		const username = req.body.username;
		const password = req.body.password;
		const phone = req.body.phone;

		// const token = uuidv4();
		const salt = uuidv4();
		const hash = SHA256(password + salt).toString(encBase64);

		if ((email || username) && password && phone) {
			const user = new User({
				email: email,
				// token: generateToken(user),
				salt: salt,
				password: hash,
				account: {
					username: username,
					phone: phone
				}
			});
			await user.save();
			res.json({
				_id: user._id,
				token: generateToken(user),
				account: user.account
			});
		}
	} catch (error) {
		res.status(400).json({
			message: error.message
		});
	}
});

// Login User
router.post('/logUsers', async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email: email });
		if (SHA256(password + user.salt).toString(encBase64) === user.password) {
			res.send({
				_id: user._id,
				email: user.email,
				account: user.account,
				token: generateToken(user)
			});
		} else {
			res.status(401).send({
				message: 'Wrong credentials'
			});
		}
	} catch (error) {
		res.status(400).json({
			message: error.message
		});
	}
});

// Get all registered users
router.get('/users', async (req, res) => {
	try {
		const users = await User.find();
		const count = await User.countDocuments();

		if (count > 0) {
			res.json({
				count: count,
				users
			});
		} else {
			res.json({
				message: 'No users found'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
});

// Get all Ads by specific user
router.get('/usersAds', isAuthenticated, async (req, res) => {
	try {
		advertisement = await Advertisement.find({
			creator: req.user._id
		}).populate({
			path: 'creator',
			model: 'User',
			select: { account: 1 }
		});

		if (advertisement) {
			res.send(advertisement);
		} else {
			res.json({
				message: 'No Advertisements found'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
});

module.exports = router;
