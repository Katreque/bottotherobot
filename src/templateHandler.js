const TemplateEnum = require('./enums/TemplateEnums');
const TemplateSizeEnum = require('./enums/TemplateSizeEnums');
const TemplateLangEnum = require('./enums/TemplateLangEnums');

const DEFAULT_TEMPLATE_JSON = require('./templates/default.json');

function selectedTemplate(templateName) {
	const tname = templateName || '';

	switch (tname.toLowerCase()) {
		case TemplateEnum.DEFAULT:
			return DEFAULT_TEMPLATE_JSON;

		default:
			return DEFAULT_TEMPLATE_JSON;
	}
}

function selectedSize(templateSize) {
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
			return TemplateSizeEnum.SMALL;
	}
}

function selectedLang(templateLang) {
	const tlang = templateLang || '';

	switch (tlang.toUpperCase()) {
		case TemplateLangEnum.PT_BR:
			return TemplateLangEnum.PT_BR;

		case TemplateLangEnum.EN:
			return TemplateLangEnum.EN;

		default:
			return TemplateLangEnum.EN;
	}
}

async function createRoles(roles, lang, message) {
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
}

async function adjustChannelObject(channel, lang, guild, parent) {
	const channelObj = {};

	channelObj.data = {
		type: channel.type,
		permissionOverwrites: [],
		parent,
	};

	try {
		// Get fresh info about the roles created before.
		const freshRoles = await guild.roles.fetch();
	
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
}

async function createChannels(channels, size, lang, message, parent, stackCount) {
	const internalSC = stackCount || 0;

	for (let i = 0; i < channels.length; i += 1) {
		const channelConfig = await adjustChannelObject(channels[i], lang, message.guild, parent);
		try {
			const channelCreated = await message.guild.channels.create(
				channels[i].name[lang],
				channelConfig.data,
			);

			if (channelConfig.child) {
				await createChannels(channelConfig.child, size, lang, message, channelCreated);
			}

			if (channels[i].scalable) {
				const SC = internalSC + 1;

				if (SC < size) {
					await createChannels([channels[i]], size, lang, message, null, SC);
				}
			}
		} catch (error) {
			console.log(error);
			message.channel.send('Discord API Error on creating channels.');
		}
	}
}

module.exports = {
	async executeTemplate(templateName, templateSize, templateLang, message) {
		const SELECTED_TEMPLATE = selectedTemplate(templateName);
		const SELECTED_SIZE = selectedSize(templateSize);
		const SELECTED_LANG = selectedLang(templateLang);

		await createRoles(SELECTED_TEMPLATE.roles, SELECTED_LANG, message);
		await createChannels(SELECTED_TEMPLATE.channels, SELECTED_SIZE, SELECTED_LANG, message);
	},
};
