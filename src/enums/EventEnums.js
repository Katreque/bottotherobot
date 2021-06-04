const events = {
	READY: 'ready',
	MESSAGE: 'message',
	MEMBER_JOINED: 'guildMemberAdd',
	MEMBER_LEFT: 'guildMemberRemove',
};

const EventsEnum = Object.freeze(events);
module.exports = EventsEnum;
