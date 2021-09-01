require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { Client, Collection, Intents } = require('discord.js');

const Events = require('./enums/EventEnums');
const { checkDiscordInfo, checkIfExistsConfigFile } = require('./initHandler');
const { getTranslatedString } = require('./langHandler');
const { checkPrefix } = require('./prefixHandler');
const { commandHandler } = require('./commandsHandler');

// Initial Verifications
checkIfExistsConfigFile();
checkDiscordInfo(process.env.DISCORD_TOKEN, process.env.DISCORD_ID);

const USER_LANG = process.env.LANGUAGE;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`${path.resolve(__dirname, './commands')}/${file}`);
	client.commands.set(command.data.name, command);
}

// Discord Events
client.once(Events.READY, () => {
	console.log(`${getTranslatedString('BOT_ACTIVE', USER_LANG, {username: client.user.username})}`);
	console.log(`${getTranslatedString('DISCORD_BOT_INVITE', USER_LANG)} https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&permissions=8&scope=bot%20applications.commands`);
});

client.on(Events.INTERACTION, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
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
