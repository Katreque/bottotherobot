const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: 
		new SlashCommandBuilder()
		.setName('reset')
		.setDescription('**Internal Usage Only** - Reset all your channel channels and roles.')
		.setDefaultPermission(false)
	,

	async execute(interaction) {
		interaction.guild.roles.cache.each((role) => {
			if (role.name === 'Member' || role.name === 'Membro') role.delete();
		});
		interaction.guild.roles.cache.each((role) => {
			if (role.name === 'Mods' || role.name === 'Moderação') role.delete();
		});
		interaction.guild.channels.cache.each((channel) => channel.delete());

		const chronobreak = await interaction.guild.channels.create('Chronobreak');
		await chronobreak.send(`Guild reset is done!`);
	},
};
