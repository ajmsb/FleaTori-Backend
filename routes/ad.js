const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const uploadPictures = require('../middlewares/uploadPictures');

const Advertisement = require('../models/advertisement');

// Post new advertisement
router.post('/ads', isAuthenticated, uploadPictures, (req, res, next) => {
	const title = req.body.title;
	const description = req.body.description;
	const category = req.body.category;
	const location = req.body.location;
	const delivery = req.body.delivery;
	const price = req.body.price;
	const user = req.user;
	const pictures = req.pictures;

	let object = {
		title: title,
		description: description,
		category: category,
		location: location,
		delivery: delivery,
		price: price,
		creator: user
	};

	if (pictures !== undefined) {
		object.pictures = req.pictures;
	}

	const advertisement = new Advertisement(object);
	advertisement.save(function (error) {
		if (!error) {
			res.send({
				_id: advertisement._id,
				title: advertisement.title,
				description: advertisement.description,
				category: advertisement.category,
				location: advertisement.location,
				delivery: advertisement.delivery,
				price: advertisement.price,
				pictures: advertisement.pictures,
				creator: {
					account: advertisement.creator.account,
					_id: advertisement.creator._id
				},
				created: advertisement.created
			});
		} else {
			return next(error.message);
		}
	});
});

// Get all advertisements in the database
router.get('/ads', async (req, res) => {
	try {
		const advertisements = await Advertisement.find();

		if (advertisements.length > 0) {
			res.send(advertisements);
		} else {
			res.send({
				message: 'no advertisements in database'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
});

// Get ads Newer to older with count
router.get('/ads/count', function (req, res) {
	const filter = {};
	Advertisement.count(filter, (err, count) => {
		const query = Advertisement.find(filter)
			.populate({
				path: 'creator',
				select: 'account'
			})
			.sort({ created: -1 });

		switch (req.query.sort) {
			case 'dateDesc':
				query.sort({ created: -1 });
				break;
			case 'dateAsc':
				query.sort({ created: 1 });
				break;
			default:
		}

		query.exec((err, advertisements) => {
			res.json({ count, advertisements });
		});
	});
});

// Get ads by :id
router.get('/ads/:id', async (req, res) => {
	try {
		const advertisementId = req.params.id;
		advertisement = await Advertisement.findById(advertisementId).populate({
			path: 'creator',
			model: 'User',
			select: { account: 1 }
		});

		if (advertisement) {
			res.send(advertisement);
		} else {
			res.send({
				message: 'No ads with this id'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
});

// Get ads by Category

router.get('/category/:category', async (req, res) => {
	const category = req.params.category;
	try {
		const advertisement = await Advertisement.find({ category });
		// console.log(advertisement);
		if (advertisement) {
			res.send(advertisement);
		} else {
			res.send({
				message: 'No ads with this id'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
});

//Get ads by location
router.get('/location/:location', async (req, res) => {
	const location = req.params.location;
	try {
		const advertisement = await Advertisement.find({ location });
		// console.log(advertisement);
		if (advertisement) {
			res.send(advertisement);
		} else {
			res.send({
				message: 'No ads with this id'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
});

// Delete advertisement
router.delete('/delete/:id', isAuthenticated, function (req, res, next) {
	Advertisement.findOneAndDelete(
		{
			_id: req.params.id,
			creator: req.user
		},
		function (err, obj) {
			if (err) {
				return next(err.message);
			}
			if (!obj) {
				res.status(404);
				return res.json({ message: 'No Ad with this id to delete' });
			} else {
				return res.json({ message: 'Ad deleted!' });
			}
		}
	);
});

module.exports = router;
