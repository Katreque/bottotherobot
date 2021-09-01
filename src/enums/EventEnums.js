const events = {
	READY: 'ready',
	INTERACTION: 'interactionCreate',
	MEMBER_JOINED: 'guildMemberAdd',
	MEMBER_LEFT: 'guildMemberRemove',
};

const EventsEnum = Object.freeze(events);
module.exports = EventsEnum;
