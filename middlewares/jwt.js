const jwt = require('jsonwebtoken');

const generateToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			account: user.account
		},
		process.env.JWT_SECRET || 'secretJWT',
		{
			expiresIn: '1h'
		}
	);
};

module.exports = generateToken;
