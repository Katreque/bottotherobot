module.exports = {
	checkDiscordInfo(DISCORD_TOKEN, DISCORD_ID, PREFIX) {
		if (!DISCORD_TOKEN || !DISCORD_ID || !PREFIX) {
			throw new Error('DISCORD_ID or DISCORD_TOKEN or PREFIX must be in the .env file.');
		}
	},
};
