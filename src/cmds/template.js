module.exports.run = (client, message, args) => {
	message.channel.send(`This is a template! ${args.join(' ')}`);
};

module.exports.help = {
	name: 'template',
};
