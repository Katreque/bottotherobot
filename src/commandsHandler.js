const CommandsEnum = require('./enums/CommandsEnums');
const TemplateHandler = require('./templateHandler');

module.exports = {
	async handleCommand(message, BOT_PREFIX) {
		const isAdmin = message.member.hasPermission('ADMINISTRATOR');
		if (message.content.toString()[0] === BOT_PREFIX && isAdmin) {
			const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();

			switch (command) {
				case CommandsEnum.HELLO:
					message.channel.send('Hello there. General Kenobi!');
					break;

				case CommandsEnum.TEMPLATE: {
					const templateName = args[0];
					const templateSize = args[1];
					const templateLang = args[2];

					TemplateHandler.executeTemplate(templateName, templateSize, templateLang, message);
					break;
				}

				// Only for testing purposes
				case CommandsEnum.RESET_GUILD:
					message.guild.roles.cache.find(role => {if (role.name === "Member" || role.name === "Membro")  role.delete(); });
					message.guild.roles.cache.find(role => {if (role.name === "Mods" || role.name === "Moderação") role.delete(); });
					message.guild.channels.cache.each(async (channel) => await channel.delete());
					await message.guild.channels.create("Chronobreak");
					break;

				default:
					message.channel.send('Command not recognized.');
					break;
			}
		} else if (!isAdmin) {
			message.channel.send('You must be an Admin to perform this command.');
		}
	},
};
