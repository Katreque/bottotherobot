const { SlashCommandBuilder } = require('@discordjs/builders');
const { data, execute } = require("../../../src/commands/owner/resetGuild");

test('data - Check if func is defined.', () => {
    expect(data).toBeDefined();
});

test('data - Should return a SlashCommandBuilder object.', () => {
	const r = new SlashCommandBuilder()
		.setName('reset')
		.setDescription('**Internal Usage Only** - Reset all your channel channels and roles.')
		.setDefaultPermission(false);

    expect(data).toEqual(r);
});

test('execute - Check if func is defined.', () => {
    expect(execute).toBeDefined();
});

test('execute - Should do the right Discord API calls.', () => {
	const channel = {name: 'a', delete: jest.fn()};

	let interaction = {
		guild: {
			channels: {
				cache: {
					each: jest.fn().mockImplementation((cb) => cb(channel)),
				},
				create: jest.fn().mockResolvedValue({send: jest.fn()})
			}
		}
	}

	execute(interaction);
	
	expect(interaction.guild.channels.cache.each).toHaveBeenCalledTimes(1);
	expect(channel.delete).toHaveBeenCalledTimes(1);

	expect(interaction.guild.channels.create).toHaveBeenCalledTimes(1);
	expect(interaction.guild.channels.create).toHaveBeenCalledWith('Chronobreak');
});
