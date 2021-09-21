const { SlashCommandBuilder } = require('@discordjs/builders');
const getRole = require("../../../src/commands/user/getRole");

describe('data', () => {

	test('Check if func is defined.', () => {
		expect(getRole.data).toBeDefined();
	});
	
	test('Should return a SlashCommandBuilder object.', () => {
		const r = new SlashCommandBuilder()
			.setName('role')
			.setDescription('Get your role.')
			.setDefaultPermission(true)
			.addStringOption((option) => option.setName('options')
				.setDescription('Choose the role you want:')
				.setRequired(true)
				.addChoices(getRole.setChoicesArray()));
	
		expect(getRole.data).toEqual(r);
	});

})

describe('setChoicesArray', () => {

	test('Check if func is defined.', () => {
		expect(getRole.setChoicesArray).toBeDefined();
	});

	test('Should return the right object.', () => {
		expect(getRole.setChoicesArray()).toEqual([
			[ 'Desenvolvimento', 'Desenvolvimento' ],
			[ 'eSports', 'eSports' ],
			[ 'Membro', 'Membro' ]
		]);
	});
});

describe('matchName', () => {

	test('Check if func is defined.', () => {
		expect(getRole.matchName).toBeDefined();
	});

	test('Should return true.', () => {
		expect(getRole.matchName('a', 'a')).toBe(true);
	});

	test('Should return false.', () => {
		expect(getRole.matchName('a', 'b')).toBe(false);
	});

});

describe('execute', () => {

	beforeAll(() => {
		getRole['matchName'] = jest.fn();
	})

	test('Check if func is defined.', () => {
		expect(getRole.execute).toBeDefined();
	});

	test('Should do the right function calls when the user does have the role.', async () => {
		getRole['matchName'] = jest.fn().mockReturnValue(true);

		let interaction = {
			guild: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({name: 'Pog'}))
					}
				}
			},
			member: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({name: 'Pog'}))
					},
					remove: jest.fn()
				}
			},
			reply: jest.fn(),
			options: {
				getString: jest.fn().mockReturnValue('Membro')
			}
		}

		await getRole.execute(interaction);

		expect(interaction.options.getString).toHaveBeenCalledTimes(1);
		expect(interaction.member.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(getRole.matchName).toHaveBeenCalledTimes(1);
		expect(interaction.member.roles.remove).toHaveBeenCalledTimes(1);

		expect(interaction.reply).toHaveBeenCalledTimes(1);
		expect(interaction.reply).toHaveBeenCalledWith({ content: `Role **Membro** was removed.`, ephemeral: true });
	});

	test('Should do the right function calls when the user doesnt have the role.', async () => {
		getRole['matchName'] = jest.fn().mockReturnValue(true).mockReturnValueOnce(false);

		let interaction = {
			guild: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({name: 'Pog'}))
					}
				}
			},
			member: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({name: 'Pog'}))
					},
					add: jest.fn()
				}
			},
			reply: jest.fn(),
			options: {
				getString: jest.fn().mockReturnValue('Membro')
			}
		}

		await getRole.execute(interaction);

		expect(interaction.options.getString).toHaveBeenCalledTimes(1);
		expect(interaction.member.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(interaction.guild.roles.cache.find).toHaveBeenCalledTimes(1);
		expect(interaction.member.roles.add).toHaveBeenCalledTimes(1);

		expect(interaction.reply).toHaveBeenCalledTimes(1);
		expect(interaction.reply).toHaveBeenCalledWith({ content: `Role **Membro** was added.`, ephemeral: true });
	});

	test('Should do the right function calls when the role doesnt exist.', async () => {
		let interaction = {
			guild: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({name: 'Pog'}))
					}
				}
			},
			member: {
				roles: {
					cache: {
						find: jest.fn((cb) => cb({name: 'Pog'}))
					},
					add: jest.fn(),
					remove: jest.fn()
				}
			},
			reply: jest.fn(),
			options: {
				getString: jest.fn().mockReturnValue('noup')
			}
		}

		await getRole.execute(interaction);

		expect(interaction.options.getString).toHaveBeenCalledTimes(1);
		expect(interaction.member.roles.add).not.toHaveBeenCalled();
		expect(interaction.member.roles.remove).not.toHaveBeenCalled();

		expect(interaction.reply).toHaveBeenCalledTimes(1);
		expect(interaction.reply).toHaveBeenCalledWith({ content: `Role **noup** was not found.`, ephemeral: true });
	});

	test('Discord API died.', async () => {
		let interaction = {
			editReply: jest.fn(),
			options: {
				getString: jest.fn(() => { throw new Error(); })
			}
		}

		await getRole.execute(interaction);

		expect(interaction.editReply).toHaveBeenCalledTimes(1);
		expect(interaction.editReply).toHaveBeenCalledWith({ content: 'Getting role error.', ephemeral: true });
	});

});
