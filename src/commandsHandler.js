const CommandsEnum = require('./enums/CommandsEnums');

module.exports = {
	handleCommand(message, BOT_PREFIX) {
		const commandArray = message.content.split(' ');
		const isAdmin = message.member.hasPermission('ADMINISTRATOR');
		if (message.content.toString()[0] === BOT_PREFIX && isAdmin) {
			const command = commandArray[0].replace(BOT_PREFIX, '');
			switch (command) {
				case CommandsEnum.HELLO:
					message.channel.send('Hello there. General Kenobi!');
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
