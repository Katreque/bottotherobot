const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: 
		new SlashCommandBuilder()
		.setName('role')
		.setDescription('Get your role.')
		.setDefaultPermission(true)
		.addStringOption(option =>
			option.setName('pick')
				.setDescription('Choose the role you want:')
				.setRequired(true)
				.addChoice('Funny', 'gif_funny')
				.addChoice('Meme', 'gif_meme')
				.addChoice('Movie', 'gif_movie'))
	,

	async execute(interaction) {
		const string = interaction.options.getString('pick');
		interaction.reply(string);
	},
};
