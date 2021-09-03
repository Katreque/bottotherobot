require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];

const commandUserFiles = fs.readdirSync(path.resolve(__dirname, './commands/user')).filter(file => file.endsWith('.js'));
for (const file of commandUserFiles) {
	const command = require(`${path.resolve(__dirname, './commands/user')}/${file}`);
	commands.push(command.data.toJSON());
};

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		commands.forEach(async command => {
			await rest.post(
				Routes.applicationGuildCommands(process.env.DISCORD_ID, process.env.GUILD_ID),
				{ body: command },
			);
		})

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
