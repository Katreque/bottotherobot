const { SlashCommandBuilder } = require('@discordjs/builders');
const templateHandler = require('../../../src/commands/owner/templateHandler');

const selectedTemplateObj = {
	roles: [
		{
            "name": "teste",
			"color": "#ff005a",
            "permissions": "8",
			"hoist": true,
			"mentionable": false,
			"gettable": false
        }
	],
	channels: [

	]
}

describe('data', () => {

	test('Check if func is defined.', () => {
		expect(templateHandler.data).toBeDefined();
	});
	
	test('Should return a SlashCommandBuilder object.', () => {
		const r = new SlashCommandBuilder()
			.setName('template')
			.setDescription('Set up your Discord based on the template configuration.')
			.setDefaultPermission(false);
	
		expect(templateHandler.data).toEqual(r);
	});

});


describe('selectedTemplate', () => {

	beforeAll(() => {
		templateHandler['selectedTemplate'] = jest.fn(() => { return selectedTemplateObj });
	})

	test('Check if func is defined.', () => {
		expect(templateHandler.selectedTemplate).toBeDefined();
	});
	
	test('Should return the right object.', () => {
		const r = templateHandler.selectedTemplate();
	
		expect(templateHandler.selectedTemplate).toHaveBeenCalledTimes(1);
		expect(r).toEqual(selectedTemplateObj);
	});

});

describe('createRoles', () => {

	beforeAll(() => {
		templateHandler['selectedTemplate'] = jest.fn(() => { return selectedTemplateObj });
	})

	test('Check if func is defined.', () => {
		expect(templateHandler.createRoles).toBeDefined();
	});
	
	test('Role already exists, so the edit role api is called.', () => {
		let interaction = {
			guild: {
				roles: {
					cache: {
						find: jest.fn().mockReturnValue({id: 'a'})
					},
					create: jest.fn(),
					edit: jest.fn().mockResolvedValue({})
				}
			}
		}
	
		templateHandler.createRoles(selectedTemplateObj.roles, interaction);
	
		expect(interaction.guild.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.edit).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.edit).toHaveBeenCalledWith('a', { permissions: selectedTemplateObj.roles[0].permissions });
	});
	
	test('Role already exists, but API died.', () => {
		let interaction = {
			editReply: jest.fn().mockResolvedValue({}),
			guild: {
				roles: {
					cache: {
						find: jest.fn().mockReturnValue({id: 'a'})
					},
					create: jest.fn(),
					edit: jest.fn(() => { throw new Error(); })
				}
			}
		}
	
		templateHandler.createRoles(selectedTemplateObj.roles, interaction);
	
		expect(interaction.guild.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(() => {interaction.guild.roles.edit()}).toThrow();
	
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Discord API Error on editing @everyone role.', ephemeral: true });
	});
	
	test('Role doesnt exist, so the create role api is called.', () => {
		const createObj = {
			name: selectedTemplateObj.roles[0].name,
			color: selectedTemplateObj.roles[0].color,
			permissions: selectedTemplateObj.roles[0].permissions,
			mentionable: selectedTemplateObj.roles[0].mentionable,
			hoist: selectedTemplateObj.roles[0].hoist,
		}
	
		let interaction = {
			guild: {
				roles: {
					cache: {
						find: jest.fn().mockReturnValue(false)
					},
					create: jest.fn().mockResolvedValue(createObj)
				}
			}
		}
	
		templateHandler.createRoles(selectedTemplateObj.roles, interaction);
	
		expect(interaction.guild.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.create).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.create).toHaveBeenCalledWith(createObj);
	});
	
	test('Role doesnt exist, but API died.', () => {
		let interaction = {
			editReply: jest.fn().mockResolvedValue({}),
			guild: {
				roles: {
					cache: {
						find: jest.fn().mockReturnValue(false)
					},
					create: jest.fn(() => { throw new Error(); })
				}
			}
		}
	
		templateHandler.createRoles(selectedTemplateObj.roles, interaction);
	
		expect(interaction.guild.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(() => {interaction.guild.roles.create()}).toThrow();
	
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Discord API Error on creating roles.', ephemeral: true });
	});

});

describe('execute', () => {

	beforeAll(() => {
		jest.resetAllMocks();
		templateHandler['createRoles'] = jest.fn();
		templateHandler['createChannels'] = jest.fn();
	})

	test('Check if func is defined.', () => {
		expect(templateHandler.execute).toBeDefined();
		expect(jest.isMockFunction(templateHandler.createRoles)).toBe(true);
		expect(jest.isMockFunction(templateHandler.createChannels)).toBe(true);
	});
	
	test('Should do the right function calls.', () => {
		let interaction = {
			deferReply: jest.fn().mockResolvedValue({}),
			editReply: jest.fn().mockResolvedValue({}),
			guild: {
				roles: {
					cache: {
						find: jest.fn().mockReturnValue(false)
					},
					create: jest.fn().mockResolvedValue({}),
					fetch: jest.fn()
				}
			}
		}
	
		templateHandler.execute(interaction);
	
		expect(interaction.deferReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Template\'s execution is done!', ephemeral: true });
	});

});

