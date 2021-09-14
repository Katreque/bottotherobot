const { SlashCommandBuilder } = require('@discordjs/builders');
const { data, execute } = require('../../../src/commands/owner/templateHandler');

jest.mock('../../../src/commands/owner/templateHandler', () => {
	const originalModule = jest.requireActual('../../../src/commands/owner/templateHandler');
  
	return {
		__esModule: true,
		...originalModule,
		_selectedTemplate: jest.fn(() => { return {roles: [], channels: []} })
	};
});

test('data - Check if func is defined.', () => {
    expect(data).toBeDefined();
});

test('data - Should return a SlashCommandBuilder object.', () => {
	const r = new SlashCommandBuilder()
		.setName('template')
		.setDescription('Set up your Discord based on the template configuration.')
		.setDefaultPermission(false);

    expect(data).toEqual(r);
});

test('execute - Check if func is defined.', () => {
    expect(execute).toBeDefined();
});

/*test('execute - Should do the right function calls.', () => {
	let interaction = {
		deferReply: jest.fn(),
		editReply: jest.fn()
	}

	execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
	expect(interaction.editReply).toHaveBeenCalledTimes(1);
});*/
