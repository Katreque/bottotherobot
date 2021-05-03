require('dotenv').config();

const Discord = require('discord.js');
const Events = require('./enums/EventEnums');
const { checkDiscordInfo } = require('./initHandler');
const { checkPrefix } = require('./prefixHandler');
const { handleCommand } = require('./commandsHandler');

const client = new Discord.Client();

checkDiscordInfo(process.env.DISCORD_TOKEN, process.env.DISCORD_ID);

client.on(Events.READY, () => {
	console.log(`${client.user.username} is swimming.`);
	console.log(`Your Discord bot invite: https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=bot&permissions=8`);
});

client.on(Events.MESSAGE, async (message) => {
	const prefix = process.env.BOT_PREFIX;
	checkPrefix(prefix);
	await handleCommand(message, prefix);
});

client.login(process.env.DISCORD_TOKEN);
