const TemplateEnum = require('./enums/TemplateEnums');
const TemplateSizeEnum = require('./enums/TemplateSizeEnums');
const TemplateLangEnum = require('./enums/TemplateLangEnums');

const DEFAULT_TEMPLATE_JSON = require('./templates/default.json');

module.exports = {
	selectedTemplate(templateName) {
		const tname = templateName || '';

		switch (tname.toLowerCase()) {
			case TemplateEnum.DEFAULT:
				return DEFAULT_TEMPLATE_JSON;

			default:
				return DEFAULT_TEMPLATE_JSON;
		}
	},

	selectedSize(templateSize) {
		const tsize = templateSize || '';

		switch (tsize.toLowerCase()) {
			case TemplateSizeEnum.SMALL:
				return 1;

			case TemplateSizeEnum.MEDIUM:
				return 2;

			case TemplateSizeEnum.BIG:
				return 3;

			case TemplateSizeEnum.GIANT:
				return 4;

			default:
				return 1;
		}
	},

	selectedLang(templateLang) {
		const tlang = templateLang || '';

		switch (tlang.toUpperCase()) {
			case TemplateLangEnum.PT_BR:
				return TemplateLangEnum.PT_BR;

			case TemplateLangEnum.EN:
				return TemplateLangEnum.EN;

			default:
				return TemplateLangEnum.EN;
		}
	},

	async createRoles(roles, lang, message) {
		roles.forEach(async (role) => {
			try {
				await message.guild.roles.create({
					data: {
						name: role.name[lang],
						color: role.color,
						position: role.position,
						permissions: role.permissions,
						mentionable: role.mentionable,
						hoist: role.hoist,
					},
				});
			} catch (error) {
				console.log(error);
				message.channel.send('Discord API Error on creating roles.');
			}
		});
	},

	async adjustChannelObject(channel, lang, message, parent) {
		const channelObj = {};

		channelObj.data = {
			type: channel.type,
			permissionOverwrites: [],
			parent,
		};

		try {
			// Get fresh info about the roles created before.
			const freshRoles = await message.guild.roles.fetch();

			if (channel.permissionOverwrites.length) {
				channel.permissionOverwrites.forEach((po) => {
					const roleName = freshRoles.cache.find((role) => role.name === po.name[lang]);
					channelObj.data.permissionOverwrites.push({
						id: roleName,
						allow: po.allow,
						deny: po.deny,
					});
				});
			}
		} catch (error) {
			console.log(error);
			message.channel.send('Discord API Error on getting roles.');
		}

		channelObj.child = channel.child;
		return channelObj;
	},

	async createChannels(channels, size, lang, message, parent, stackCount) {
		const internalSC = stackCount || 0;

		for (let i = 0; i < channels.length; i += 1) {
			const channelConfig = await this.adjustChannelObject(channels[i], lang, message, parent);
			try {
				const channelCreated = await message.guild.channels.create(
					channels[i].name[lang],
					channelConfig.data,
				);

				if (channelConfig.child) {
					await this.createChannels(channelConfig.child, size, lang, message, channelCreated);
				}

				if (channels[i].scalable) {
					const SC = internalSC + 1;

					if (SC < size) {
						await this.createChannels([channels[i]], size, lang, message, null, SC);
					}
				}
			} catch (error) {
				console.log(error);
				message.channel.send('Discord API Error on creating channels.');
			}
		}
	},

	async executeTemplate(templateName, templateSize, templateLang, message) {
		const SELECTED_TEMPLATE = this.selectedTemplate(templateName);
		const SELECTED_SIZE = this.selectedSize(templateSize);
		const SELECTED_LANG = this.selectedLang(templateLang);

		await this.createRoles(SELECTED_TEMPLATE.roles, SELECTED_LANG, message);
		await this.createChannels(SELECTED_TEMPLATE.channels, SELECTED_SIZE, SELECTED_LANG, message);
	},
};
