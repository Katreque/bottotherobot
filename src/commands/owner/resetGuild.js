const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName('reset')
			.setDescription('**Internal Usage Only** - Reset all your channel channels and roles.')
			.setDefaultPermission(false),

	async execute(interaction) {
		/* interaction.guild.roles.cache.each(async (role) => {
			if (!(role.name === "@everyone")) {
				await role.delete();
			}
		}); */
		interaction.guild.channels.cache.each((channel) => channel.delete());

		const chronobreak = await interaction.guild.channels.create('Chronobreak');
		await chronobreak.send('Guild reset is done!');
	},
};
