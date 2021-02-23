const hey = (req, res, next) => {
	console.log('Hey!');
	next();
};
const how = (req, res, next) => {
	console.log('How are you?');
	next();
};

module.exports = { hey, how };
