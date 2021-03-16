// const Discord = require("discord.js");

const Discord = require('discord.js');
const { checkDiscordInfo } = require('./initHandler');

const client = new Discord.Client();

checkDiscordInfo(process.env.DISCORD_TOKEN, process.env.DISCORD_ID);

client.on('ready', () => {
	console.log(`${client.user.username} is swimming.`);
	console.log(`Your Discord bot invite: https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=bot&permissions=8`);
});

client.login(process.env.DISCORD_TOKEN);
