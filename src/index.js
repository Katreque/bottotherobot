require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const { checkDiscordInfo } = require('./initHandler');

const client = new Discord.Client();
client.cmds = new Discord.Collection();
fs.readdir('./src/cmds/', (err, files) => {
	if (err) console.log(err);

	const jsfile = files.filter((f) => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		console.log('Err: Could not find commands.');
		return;
	}
	jsfile.forEach((f) => {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const prop = require(`./cmds/${f}`);
		console.log(`${f} loaded!`);
		client.cmds.set(prop.help.name, prop);
	});
});

checkDiscordInfo(process.env.DISCORD_TOKEN, process.env.DISCORD_ID, process.env.PREFIX);

client.on('ready', () => {
	console.log(`${client.user.username} is swimming.`);
	console.log(`Your Discord bot invite: https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=bot&permissions=8`);
});

client.on('message', (message) => {
	if (message.channel.type === 'dm') return;
	if (message.author.bot) return;

	const prefix = process.env.PREFIX;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member.permissions.has('ADMINISTRATOR')) return;
	const messageArray = message.content.split(' ');
	const cmd = messageArray[0];
	const args = messageArray.slice(1);
	const cmdFile = client.cmds.get(cmd.slice(prefix.length));
	if (cmdFile) cmdFile.run(client, message, args);
});

client.login(process.env.DISCORD_TOKEN);
