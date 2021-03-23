module.exports = {
	checkDiscordInfo(DISCORD_TOKEN, DISCORD_ID) {
		if (!(DISCORD_TOKEN && DISCORD_ID)) {
			throw new Error('DISCORD_ID or DISCORD_TOKEN must be in the .env file.');
		}
	},
};
