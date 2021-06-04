const fs = require('fs');

module.exports = {
	checkDiscordInfo(DISCORD_TOKEN, DISCORD_ID) {
		if (!(DISCORD_TOKEN && DISCORD_ID)) {
			throw new Error('DISCORD_ID and DISCORD_TOKEN must be in the .env file.');
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
