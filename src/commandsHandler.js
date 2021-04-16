const CommandsEnum = require('./enums/CommandsEnums');
const TemplateHandler = require('./templateHandler');

module.exports = {
	handleCommand(message, BOT_PREFIX) {
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

					TemplateHandler.executeTemplate(templateName, templateSize, templateLang);
					break;
				}

				default:
					message.channel.send('Command not recognized.');
					break;
			}
		} else if (!isAdmin) {
			message.channel.send('You must be an Admin to perform this command.');
		}
	},
};
