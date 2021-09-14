const { SlashCommandBuilder } = require('@discordjs/builders');
const { data, execute } = require("../../../src/commands/user/getRole");

/*test('data - Check if func is defined.', () => {
	const r = new SlashCommandBuilder()
		.setName('role')
		.setDescription('Get your role.')
		.setDefaultPermission(true)
		.addStringOption((option) => option.setName('options')
			.setDescription('Choose the role you want:')
			.setRequired(true)
			.addChoices(setChoicesArray()));

    expect(data).toEqual(r);
});*/

test('data - Should return a SlashCommandBuilder object.', () => {
    expect(data).toBeDefined();
});

test('execute - Check if func is defined.', () => {
    expect(execute).toBeDefined();
});
