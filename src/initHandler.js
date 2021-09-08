const fs = require('fs');

module.exports = {
	checkDiscordInfo(DISCORD_TOKEN, DISCORD_ID, GUILD_ID) {
		if (!(DISCORD_TOKEN && DISCORD_ID && GUILD_ID)) {
			throw new Error('DISCORD_ID, DISCORD_TOKEN and GUILD_ID must be in the .env file.');
		}
	},

	checkIfExistsConfigFile() {
		if (!fs.existsSync('config.json')) {
			const template = {
				user_joined_channel: '',
				user_left_channel: '',
			};
	
			fs.writeFile('config.json', JSON.stringify(template), () => {});
			return template;
		}
	},
};
