'use sctrict';
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//Middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/', cors());

//database connection
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//Routes
app.get('/', (req, res) => {
	res.send({ message: 'Welcome to Home Page!' });
});

const adRoutes = require('./routes/ad');
const userRoutes = require('./routes/user');

app.use(adRoutes);
app.use(userRoutes);

//Server start
app.listen(process.env.PORT || 3000, (err) => {
	if (err) {
		console.log('Something is wrong', err);
		return;
	}
	console.log('server running at: http://localhost:3000/');
});
