const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const DEFAULT_TEMPLATE_JSON = require('../../templates/default.json');

function selectedTemplate() {
	return DEFAULT_TEMPLATE_JSON;
}

async function createRoles(roles, interaction) {
	roles.forEach(async (role) => {
		const roleExist = interaction.guild.roles.cache.find((r) => r.name === role.name);

		if (roleExist) {
			try {
				interaction.guild.roles.edit(roleExist.id, { permissions: role.permissions });
			} catch (error) {
				console.log(error);
				interaction.editReply({ content: 'Discord API Error on editing @everyone role.', ephemeral: true });
			}
		} else {
			try {
				interaction.guild.roles.create({
					name: role.name,
					color: role.color,
					permissions: role.permissions,
					mentionable: role.mentionable,
					hoist: role.hoist,
				});
			} catch (error) {
				console.log(error);
				interaction.editReply({ content: 'Discord API Error on creating roles.', ephemeral: true });
			}
		}
	});
}

async function adjustChannelObject(channel, interaction, parent) {
	const channelObj = {};

	channelObj.data = {
		type: channel.type,
		permissionOverwrites: [],
		parent,
	};

	try {
		// Get fresh info about the roles created before.
		const freshRolesMap = await interaction.guild.roles.fetch();

		if (channel.permissionOverwrites.length) {
			channel.permissionOverwrites.forEach((po) => {
				const roleName = freshRolesMap.find((role) => role.name === po.name);
				channelObj.data.permissionOverwrites.push({
					id: roleName,
					allow: po.allow,
					deny: po.deny,
				});
			});
		}
	} catch (error) {
		console.log(error);
		interaction.editReply({ content: 'Discord API Error on getting roles.', ephemeral: true });
	}

	channelObj.child = channel.child;
	return channelObj;
}

async function createChannels(channels, interaction, parent) {
	for (let i = 0; i < channels.length; i += 1) {
		const channelConfig = await this.adjustChannelObject(channels[i], interaction, parent);
		try {
			const channelCreated = await interaction.guild.channels.create(
				channels[i].name,
				channelConfig.data,
			);

			if (channels[i].userJoinedChannel) {
				const CONFIG = require('../../../config.json');
				CONFIG.user_joined_channel = channelCreated.id;
				fs.writeFileSync('config.json', JSON.stringify(CONFIG), () => {});
			}

			if (channels[i].userLeftChannel) {
				const CONFIG = require('../../../config.json');
				CONFIG.user_left_channel = channelCreated.id;
				fs.writeFileSync('config.json', JSON.stringify(CONFIG), () => {});
			}

			if (channelConfig.child) {
				await this.createChannels(channelConfig.child, interaction, channelCreated);
			}
		} catch (error) {
			console.log(error);
			interaction.editReply({ content: 'Discord API Error on creating channels.', ephemeral: true });
		}
	}
}

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName('template')
			.setDescription('Set up your Discord based on the template configuration.')
			.setDefaultPermission(false),

	async execute(interaction) {
		await interaction.deferReply();

		await this.createRoles(this.selectedTemplate().roles, interaction);
		await this.createChannels(this.selectedTemplate().channels, interaction);
		await interaction.editReply({ content: 'Template\'s execution is done!', ephemeral: true });
	},
	selectedTemplate,
	createRoles,
	adjustChannelObject,
	createChannels,
};
