require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandOwnerFiles = fs.readdirSync(path.resolve(__dirname, './commands/owner')).filter(file => file.endsWith('.js'));
for (const file of commandOwnerFiles) {
	const command = require(`${path.resolve(__dirname, './commands/owner')}/${file}`);
	commands.push(command.data.toJSON());
};

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

const ownerCommands = [];

(async () => {
	try {

		commands.forEach(async command => {
			let _commands = await rest.post(
				Routes.applicationGuildCommands(process.env.DISCORD_ID, process.env.GUILD_ID),
				{ body: command },
			);
			ownerCommands.push(_commands);
		})

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}

	try {
		const guild = await rest.get(
			Routes.guild(process.env.GUILD_ID),
		);

		let json = [];

		ownerCommands.forEach(comm => {
			json.push(
				{
					id: comm.id,
					permissions: [
						{
							id: guild?.owner_id,
							type: 2,
							permission: true
						}
					]
				}
			)
		});

		await rest.put(
			Routes.guildApplicationCommandsPermissions(process.env.DISCORD_ID, process.env.GUILD_ID),
			{ body: json },
		);

		console.log('Successfully registered application permissions.');
	} catch (error) {
		console.error(error);
	}
})();
