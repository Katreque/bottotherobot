require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${path.resolve(__dirname, './commands')}/${file}`);
	commands.push(command.data.toJSON());
};

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

let allCommands;

(async () => {
	try {
		allCommands = await rest.put(
			Routes.applicationGuildCommands(process.env.DISCORD_ID, "838848243269763143"),
			//Routes.applicationCommands(process.env.DISCORD_ID),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}

	try {
		let json = [];

		allCommands.forEach(comm => {
			json.push(
				{
					id: comm.id,
					permissions: [
						{
							id: '883074867287699499',
							type: 1,
							permission: true
						}
					]
				}
			)
		});

		await rest.put(
			Routes.guildApplicationCommandsPermissions(process.env.DISCORD_ID, '838848243269763143'),
			{ body: json },
		);

		console.log('Successfully registered application permissions.');
	} catch (error) {
		console.error(error);
	}
})();
