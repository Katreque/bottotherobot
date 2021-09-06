const { SlashCommandBuilder } = require('@discordjs/builders');
const DEFAULT_JSON = require('../../templates/default.json');

module.exports = {
	data:
		new SlashCommandBuilder()
		.setName('role')
		.setDescription('Get your role.')
		.setDefaultPermission(true)
		.addStringOption(option =>
			option.setName('options')
				.setDescription('Choose the role you want:')
				.setRequired(true)
				.addChoices(setChoicesArray()))
	,

	async execute(interaction) {
		const string = interaction.options.getString('options');
		
		DEFAULT_JSON.roles.forEach(async role => {
			try {
				if (string === role.name) {
					let selectedRole = interaction?.member.roles.cache.find(r => r.name === role.name);
	
					if (selectedRole) {
						interaction?.member.roles.remove(selectedRole);
						return await interaction.reply({content: `Role **${role.name}** was removed.`, ephemeral: true});
					}

					selectedRole = interaction?.guild.roles.cache.find(r => r.name === role.name);
					interaction?.member.roles.add(selectedRole);
					return await interaction.reply({content: `Role **${role.name}** was added.`, ephemeral: true});
				}				
			} catch (error) {
				console.log(error);
				interaction.editReply({content: 'Getting role error.', ephemeral: true});
			}
		});
	},
};

function setChoicesArray() {
	const array = [];

	DEFAULT_JSON.roles.forEach(role => {
		if (role.gettable) {
			array.push([role.name, role.name]);
		}
	});

	return array;
}
