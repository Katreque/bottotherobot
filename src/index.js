require('dotenv').config();

const Discord = require('discord.js');
const Events = require('./enums/EventEnums');
const { checkDiscordInfo, checkIfExistsConfigFile } = require('./initHandler');
const { getTranslatedString } = require('./langHandler');
const { checkPrefix } = require('./prefixHandler');
const { handleCommand } = require('./commandsHandler');

const client = new Discord.Client();
const USER_LANG = process.env.LANGUAGE;

checkIfExistsConfigFile();
checkDiscordInfo(process.env.DISCORD_TOKEN, process.env.DISCORD_ID);

client.on(Events.READY, () => {
	console.log(`${getTranslatedString('BOT_ACTIVE', USER_LANG, {username: client.user.username})}`);
	console.log(`${getTranslatedString('DISCORD_BOT_INVITE', USER_LANG)} https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=bot&permissions=8`);
});

client.on(Events.MESSAGE, (message) => {
	const prefix = process.env.BOT_PREFIX;
	checkPrefix(prefix);
	handleCommand(message, prefix);
});

client.on(Events.MEMBER_JOINED, async (member) => {
	try {
		const CONFIG = require('../config.json');
		const channel = await member.guild.channels.cache.find((ch) => ch.id === CONFIG.user_joined_channel);
		channel.send(`**${member.displayName}** entrou.`);
	} catch (error) {
		console.log(error);
	}
});

client.on(Events.MEMBER_LEFT, async (member) => {
	try {
		const CONFIG = require('../config.json');
		const channel = await member.guild.channels.cache.find((ch) => ch.id === CONFIG.user_left_channel);
		channel.send(`**${member.displayName}** saiu.`);
	} catch (error) {
		console.log(error);
	}
});

client.login(process.env.DISCORD_TOKEN);
