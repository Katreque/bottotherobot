module.exports = {
	checkPrefix(BOT_PREFIX) {
		if (!BOT_PREFIX) {
			throw Error('This bot must configure a prefix in .env file.');
		}
	},
};