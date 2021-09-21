const fs = require('fs');
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

jest.mock('fs');

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

	test('Check if func is defined.', () => {
		expect(templateHandler.selectedTemplate).toBeDefined();
	});
	
	test('Should return the right object.', () => {
		const DEFAULT_TEMPLATE_JSON = require('../../../src/templates/default.json');
		expect(templateHandler.selectedTemplate()).toEqual(DEFAULT_TEMPLATE_JSON);
	});

});

describe('matchName', () => {

	test('Check if func is defined.', () => {
		expect(templateHandler.matchName).toBeDefined();
	});

	test('Should return true.', () => {
		expect(templateHandler.matchName('a', 'a')).toBe(true);
	});

	test('Should return false.', () => {
		expect(templateHandler.matchName('a', 'b')).toBe(false);
	});

});

describe('createRoles', () => {

	beforeAll(() => {
		templateHandler['selectedTemplate'] = jest.fn(() => { return selectedTemplateObj });
		templateHandler['matchName'] = jest.fn();
	})

	test('Check if func is defined.', () => {
		expect(templateHandler.createRoles).toBeDefined();
	});
	
	test('Role already exists, so the edit role api is called.', () => {
		templateHandler['matchName'] = jest.fn().mockReturnValue({id: 'FON'});

		let interaction = {
			guild: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({r: 'POGGERS'}))
					},
					create: jest.fn(),
					edit: jest.fn().mockResolvedValue({})
				}
			}
		}
	
		templateHandler.createRoles(selectedTemplateObj.roles, interaction);
	
		expect(interaction.guild.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(templateHandler.matchName).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.edit).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.edit).toHaveBeenCalledWith('FON', { permissions: selectedTemplateObj.roles[0].permissions });
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

describe('adjustChannelObject', () => {

	beforeAll(() => {
		templateHandler['matchName'] = jest.fn();
	})

	test('Check if func is defined.', () => {
		expect(templateHandler.adjustChannelObject).toBeDefined();
	});
	
	test('Should return the right channel object, when theres no parent, no child and no permission overwrites.', () => {
		let channel = {
			name: "BOB",
			type: "GUILD_TEXT",
			permissionOverwrites: []
		}
		
		let interaction = {
			editReply: jest.fn(),
			guild: {
				roles: {
					fetch: jest.fn().mockResolvedValue({})
				}
			}
		}

		expect(templateHandler.adjustChannelObject(channel, interaction, undefined)).resolves.toEqual({
			data: {
				type: channel.type,
				permissionOverwrites: [],
				parent: undefined,
			},
			child: undefined
		});
	});

	test('Should return the right channel object, when theres a parent, no child and no permission overwrites.', () => {
		let channel = {
			name: "BOB",
			type: "GUILD_TEXT",
			permissionOverwrites: []
		}
		
		let interaction = {
			editReply: jest.fn(),
			guild: {
				roles: {
					fetch: jest.fn().mockResolvedValue({})
				}
			}
		}

		let parent = {
			name: "BOB's Daddy",
			type: "GUILD_TEXT",
			permissionOverwrites: []
		}

		expect(templateHandler.adjustChannelObject(channel, interaction, parent)).resolves.toEqual({
			data: {
				type: channel.type,
				permissionOverwrites: [],
				parent: parent,
			},
			child: undefined
		});
	});

	test('Should return the right channel object, when theres a parent, a child and no permission overwrites.', () => {
		let channel = {
			name: "BOB",
			type: "GUILD_TEXT",
			permissionOverwrites: [],
			child: [
				{
					name: "BOB's Child",
					type: "GUILD_TEXT",
					permissionOverwrites: []
				}
			]
		}
		
		let interaction = {
			editReply: jest.fn(),
			guild: {
				roles: {
					fetch: jest.fn().mockResolvedValue({})
				}
			}
		}

		let parent = {
			name: "BOB's Daddy",
			type: "GUILD_TEXT",
			permissionOverwrites: []
		}

		expect(templateHandler.adjustChannelObject(channel, interaction, parent)).resolves.toEqual({
			data: {
				type: channel.type,
				permissionOverwrites: [],
				parent: parent,
			},
			child: channel.child
		});
	});

	test('Should return the right channel object, when theres a parent, a child and permission overwrites.', () => {
		templateHandler['matchName'] = jest.fn().mockReturnValue('Role');
		
		let channel = {
			name: "BOB",
			type: "GUILD_TEXT",
			permissionOverwrites: [
				{
					name: "KEKW",
					allow: [],
					deny: ["SEND_MESSAGES"]
				}
			],
			child: [
				{
					name: "BOB's Child",
					type: "GUILD_TEXT",
					permissionOverwrites: []
				}
			]
		}
		
		let interaction = {
			editReply: jest.fn(),
			guild: {
				roles: {
					fetch: jest.fn().mockResolvedValue({
						find: jest.fn((cb) => cb({name: 'Pog'}))
					})
				}
			}
		}

		let parent = {
			name: "BOB's Daddy",
			type: "GUILD_TEXT",
			permissionOverwrites: []
		}

		expect(templateHandler.adjustChannelObject(channel, interaction, parent)).resolves.toEqual({
			data: {
				type: channel.type,
				permissionOverwrites: [
					{
						id: "Role",
						allow: [],
						deny: ["SEND_MESSAGES"],
					}
				],
				parent: parent,
			},
			child: channel.child
		});
	});

	test('Discord API died.', () => {
		let channel = {
			name: "BOB",
			type: "GUILD_TEXT",
			permissionOverwrites: []
		}
		
		let interaction = {
			editReply: jest.fn(),
			guild: {
				roles: {
					fetch: jest.fn(() => { throw new Error(); })
				}
			}
		}

		templateHandler.adjustChannelObject(channel, interaction, undefined);

		expect(() => {interaction.guild.roles.fetch()}).toThrow();
	
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Discord API Error on getting roles.', ephemeral: true });
	});

});

describe('createChannels', () => {

	beforeEach(() => {
		fs.writeFileSync.mockClear();
		
		templateHandler['adjustChannelObject'] = jest.fn().mockResolvedValue({
			data: {
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				parent: undefined,
			},
			child: undefined
		});
	});

	test('Check if func is defined.', () => {
		expect(templateHandler.createChannels).toBeDefined();
	});

	test('Should call the right funcs with no events and no child.', async () => {
		let channels = [
			{
				name: "BOB",
				type: "GUILD_TEXT",
				permissionOverwrites: []
			}
		]

		let interaction = {
			editReply: jest.fn(),
			guild: {
				channels: {
					create: jest.fn().mockResolvedValue({id: '1'})
				}
			}
		}

		await templateHandler.createChannels(channels, interaction);

		expect(templateHandler.adjustChannelObject).toHaveBeenCalledTimes(1);

		expect(interaction.guild.channels.create).toHaveBeenCalledTimes(1);
		expect(interaction.guild.channels.create).toHaveBeenCalledWith(
			channels[0].name,
			{
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				parent: undefined,
			}
		);
	});

	test('Should call the right funcs with events and no child.', async () => {
		let channels = [
			{
				name: "NANI",
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				userJoinedChannel: true
			},
			{
				name: "OMEGALUL",
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				userLeftChannel: true
			}
		]

		let interaction = {
			editReply: jest.fn(),
			guild: {
				channels: {
					create: jest.fn().mockResolvedValue({id: '1'})
				}
			}
		}

		await templateHandler.createChannels(channels, interaction);

		expect(templateHandler.adjustChannelObject).toHaveBeenCalledTimes(2);

		expect(interaction.guild.channels.create).toHaveBeenCalledTimes(2);
		expect(interaction.guild.channels.create).toHaveBeenCalledWith(
			channels[0].name,
			{
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				parent: undefined,
			}
		);

		expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
	});

	test('Should have the right number of func calls with the recursive approach.', async () => {
		templateHandler['adjustChannelObject'] = jest.fn()
			.mockResolvedValue({
				data: {
					type: "GUILD_TEXT",
					permissionOverwrites: [],
					parent: undefined,
				},
				child: false
			})
			.mockResolvedValueOnce({
				data: {
					type: "GUILD_TEXT",
					permissionOverwrites: [],
					parent: undefined,
				},
				child: [
					{
						name: "NANI",
						type: "GUILD_TEXT",
						permissionOverwrites: []
					}
				]
			})

		const spy = jest.spyOn(templateHandler, 'createChannels');

		let channels = [
			{
				name: "NANI",
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				userJoinedChannel: true
			},
			{
				name: "OMEGALUL",
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				userLeftChannel: true
			}
		]

		let interaction = {
			editReply: jest.fn(),
			guild: {
				channels: {
					create: jest.fn().mockResolvedValue({id: '1'})
				}
			}
		}

		await templateHandler.createChannels(channels, interaction);

		expect(templateHandler.adjustChannelObject).toHaveBeenCalledTimes(3);
		expect(interaction.guild.channels.create).toHaveBeenCalledTimes(3);

		expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
		expect(spy).toHaveBeenCalledTimes(2);
	});

	test('Discord API died.', async () => {
		let channels = [
			{
				name: "NANI",
				type: "GUILD_TEXT",
				permissionOverwrites: [],
				userJoinedChannel: true
			}
		]

		let interaction = {
			editReply: jest.fn(),
			guild: {
				channels: {
					create: jest.fn(() => { throw new Error(); })
				}
			}
		}

		await templateHandler.createChannels(channels, interaction);
	
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Discord API Error on creating channels.', ephemeral: true });
	});

});

describe('execute', () => {

	beforeAll(() => {
		templateHandler['createRoles'] = jest.fn();
		templateHandler['createChannels'] = jest.fn();
	})

	test('Check if func is defined.', () => {
		expect(templateHandler.execute).toBeDefined();
		expect(jest.isMockFunction(templateHandler.createRoles)).toBe(true);
		expect(jest.isMockFunction(templateHandler.createChannels)).toBe(true);
	});
	
	test('Should do the right function calls.', async () => {
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
	
		await templateHandler.execute(interaction);
	
		expect(interaction.deferReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Template\'s execution is done!', ephemeral: true });
	});

});
