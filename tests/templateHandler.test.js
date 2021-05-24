const templateHandler = require('../src/templateHandler');
const TemplateLangEnum = require('../src/enums/TemplateLangEnums');
const DEFAULT_TEMPLATE_JSON = require('../src/templates/default.json');

afterEach(() => {    
	jest.clearAllMocks();
});

test('selectedTemplate - should return the right template json.', () => {
	let templateName = 'default';
	let r = templateHandler.selectedTemplate(templateName);
    expect(r).toBe(DEFAULT_TEMPLATE_JSON);

	templateName = 'DEFAULT';
	r = templateHandler.selectedTemplate(templateName);
    expect(r).toBe(DEFAULT_TEMPLATE_JSON);
});

test('selectedTemplate - should return the default template json if theres no match.', () => {
	let templateName = '';
	let r = templateHandler.selectedTemplate(templateName);
    expect(r).toBe(DEFAULT_TEMPLATE_JSON);

	templateName = null;
	r = templateHandler.selectedTemplate(templateName);
    expect(r).toBe(DEFAULT_TEMPLATE_JSON);
});

test('selectedSize - should return the right size number.', () => {
	let templateSize = 'small';
	let r = templateHandler.selectedSize(templateSize);
    expect(r).toBe(1);

	templateName = 'SMALL';
	r = templateHandler.selectedSize(templateName);
    expect(r).toBe(1);

	templateName = 'medium';
	r = templateHandler.selectedSize(templateName);
    expect(r).toBe(2);

	templateSize = 'MEDIUM';
	r = templateHandler.selectedSize(templateSize);
    expect(r).toBe(2);

	templateName = 'big';
	r = templateHandler.selectedSize(templateName);
    expect(r).toBe(3);

	templateSize = 'BIG';
	r = templateHandler.selectedSize(templateSize);
    expect(r).toBe(3);

	templateName = 'giant';
	r = templateHandler.selectedSize(templateName);
    expect(r).toBe(4);

	templateSize = 'GIANT';
	r = templateHandler.selectedSize(templateSize);
    expect(r).toBe(4);
});

test('selectedSize - should return the default size number if theres no match.', () => {
	let templateSize = '';
	let r = templateHandler.selectedSize(templateSize);
    expect(r).toBe(1);

	templateSize = null;
	r = templateHandler.selectedSize(templateSize);
    expect(r).toBe(1);
});

test('selectedLang - should return the right language string.', () => {
	let templateLang = 'pt_br';
	let r = templateHandler.selectedLang(templateLang);
    expect(r).toBe(TemplateLangEnum.PT_BR);

	templateLang = 'PT_BR';
	r = templateHandler.selectedLang(templateLang);
    expect(r).toBe(TemplateLangEnum.PT_BR);

	templateLang = 'en';
	r = templateHandler.selectedLang(templateLang);
    expect(r).toBe(TemplateLangEnum.EN);

	templateLang = 'EN';
	r = templateHandler.selectedLang(templateLang);
    expect(r).toBe(TemplateLangEnum.EN);
});

test('selectedLang - should return the default template json if theres no match.', () => {
	let templateLang = '';
	let r = templateHandler.selectedLang(templateLang);
    expect(r).toBe(TemplateLangEnum.EN);

	templateLang = null;
	r = templateHandler.selectedLang(templateLang);
    expect(r).toBe(TemplateLangEnum.EN);
});

test('createRoles - should call the discord API with the right params (EN).', async () => {
	const roles = [
        {
            "name": {
				"PT_BR": "Moderação",
				"EN": "Mods"
			},
			"color": "#0985c5",
			"position": 1,
            "permissions": 4260888183,
			"hoist": true,
			"mentionable": false
        },
        {
            "name": {
				"PT_BR": "Membro",
				"EN": "Member"
			},
			"color": "#1e8f36",
			"position": 0,
            "permissions": 70372929,
			"hoist": false,
			"mentionable": true
        }
    ];
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			roles: {
				create: jest.fn(() => { return true; })
			}
		}
    }

	const createRolesSpy = jest.spyOn(message.guild.roles, 'create');
	await templateHandler.createRoles(roles, 'EN', message);

	expect(createRolesSpy).toHaveBeenCalledTimes(2);
    expect(createRolesSpy).toHaveBeenCalledWith({
		data: {
			name: roles[0].name['EN'],
			color: roles[0].color,
			position: roles[0].position,
			permissions: roles[0].permissions,
			mentionable: roles[0].mentionable,
			hoist: roles[0].hoist, 
		}
	});

	expect(createRolesSpy).toHaveBeenCalledWith({
		data: {
			name: roles[1].name['EN'],
			color: roles[1].color,
			position: roles[1].position,
			permissions: roles[1].permissions,
			mentionable: roles[1].mentionable,
			hoist: roles[1].hoist, 
		}
	});
});

test('createRoles - should call the discord API with the right params (PT_BR).', async () => {
	const roles = [
        {
            "name": {
				"PT_BR": "Moderação",
				"EN": "Mods"
			},
			"color": "#0985c5",
			"position": 1,
            "permissions": 4260888183,
			"hoist": true,
			"mentionable": false
        },
        {
            "name": {
				"PT_BR": "Membro",
				"EN": "Member"
			},
			"color": "#1e8f36",
			"position": 0,
            "permissions": 70372929,
			"hoist": false,
			"mentionable": true
        }
    ];
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			roles: {
				create: jest.fn(() => { return true; })
			}
		}
    }

	const createRolesSpy = jest.spyOn(message.guild.roles, 'create');
	await templateHandler.createRoles(roles, 'PT_BR', message);

	expect(createRolesSpy).toHaveBeenCalledTimes(2);
    expect(createRolesSpy).toHaveBeenCalledWith({
		data: {
			name: roles[0].name['PT_BR'],
			color: roles[0].color,
			position: roles[0].position,
			permissions: roles[0].permissions,
			mentionable: roles[0].mentionable,
			hoist: roles[0].hoist, 
		}
	});

	expect(createRolesSpy).toHaveBeenCalledWith({
		data: {
			name: roles[1].name['PT_BR'],
			color: roles[1].color,
			position: roles[1].position,
			permissions: roles[1].permissions,
			mentionable: roles[1].mentionable,
			hoist: roles[1].hoist, 
		}
	});
});

test('createRoles - should send the right message if any error got catched.', async () => {
	const roles = [
        {
            "name": {
				"PT_BR": "Moderação",
				"EN": "Mods"
			},
			"color": "#0985c5",
			"position": 1,
            "permissions": 4260888183,
			"hoist": true,
			"mentionable": false
        },
        {
            "name": {
				"PT_BR": "Membro",
				"EN": "Member"
			},
			"color": "#1e8f36",
			"position": 0,
            "permissions": 70372929,
			"hoist": false,
			"mentionable": true
        }
    ];
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			roles: {
				create: jest.fn(() => { throw "ERRROU!"; })
			}
		}
    };

	const messageSentSpy = jest.spyOn(message.channel, 'send');
	await templateHandler.createRoles(roles, 'EN', message);

	expect(messageSentSpy).toHaveBeenCalledTimes(2);
	expect(messageSentSpy).toHaveBeenCalledWith('Discord API Error on creating roles.');
});

test('adjustChannelObject - Should return the right object for the channel creation.', async () => {
	const channel = {
		"name": {
			"PT_BR": "Informações",
			"EN": "Info"
		},
		"type": "category",
		"permissionOverwrites": [
			{
				"name": {
					"PT_BR": "Membro",
					"EN": "Member"
				},
				"allow": [],
				"deny": ["SEND_MESSAGES"]
			},
			{
				"name": {
					"PT_BR": "Moderação",
					"EN": "Mods"
				},
				"allow": ["SEND_MESSAGES"],
				"deny": []
			}
		],
		"child": [
			{
				"name": {
					"PT_BR": "bem-vindo",
					"EN": "welcome"
				},
				"type": "text",
				"permissionOverwrites": []
			},
			{
				"name": {
					"PT_BR": "regras",
					"EN": "rules"
				},
				"type": "text",
				"permissionOverwrites": []
			},
			{
				"name": {
					"PT_BR": "ajuda",
					"EN": "need-help"
				},
				"type": "text",
				"permissionOverwrites": []
			},
			{
				"name": {
					"PT_BR": "anúncios",
					"EN": "announcements"
				},
				"type": "text",
				"permissionOverwrites": []
			}
		]
	};
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			roles: {
				fetch: (() => {
					return {
						cache: {
							find: ((role) => {
								let array = [
									{
										"name": "Mods",
										"color": "#0985c5",
										"position": 1,
										"permissions": 4260888183,
										"hoist": true,
										"mentionable": false
									},
									{
										"name": "Member",
										"color": "#1e8f36",
										"position": 0,
										"permissions": 70372929,
										"hoist": false,
										"mentionable": true
									}
								];

								for (let i = 0; i < array.length; i++) {
									if (role(array[i])) {
										return array[i].name;
									};	
								}
							})
						}
					}
				})
			}
		}
    };
	const parent = {id: 'parentInfo'};

	const channelObj = await templateHandler.adjustChannelObject(channel, 'EN', message, parent);
	expect(channelObj).toStrictEqual({
		data: {
			type: channel.type,
			permissionOverwrites: [
				{
					id: 'Member',
					allow: [],
					deny: ['SEND_MESSAGES'],
				},
				{
					id: 'Mods',
					allow: ['SEND_MESSAGES'],
					deny: [],
				}
			],
			parent,
		},
		child: channel.child
	});
});

test('adjustChannelObject - Should return the right object for the channel creation when permissionOverwrites is empty.', async () => {
	const channel = {
		"name": {
			"PT_BR": "Informações",
			"EN": "Info"
		},
		"type": "category",
		"permissionOverwrites": [],
		"child": [
			{
				"name": {
					"PT_BR": "bem-vindo",
					"EN": "welcome"
				},
				"type": "text",
				"permissionOverwrites": []
			},
			{
				"name": {
					"PT_BR": "regras",
					"EN": "rules"
				},
				"type": "text",
				"permissionOverwrites": []
			},
			{
				"name": {
					"PT_BR": "ajuda",
					"EN": "need-help"
				},
				"type": "text",
				"permissionOverwrites": []
			},
			{
				"name": {
					"PT_BR": "anúncios",
					"EN": "announcements"
				},
				"type": "text",
				"permissionOverwrites": []
			}
		]
	};
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			roles: {
				fetch: (() => {
					return {
						cache: {
							find: {}
						}
					}
				})
			}
		}
    };
	const parent = {id: 'parentInfo'};

	const channelObj = await templateHandler.adjustChannelObject(channel, 'EN', message, parent);
	expect(channelObj).toStrictEqual({
		data: {
			type: channel.type,
			permissionOverwrites: [],
			parent,
		},
		child: channel.child
	});
});

test('adjustChannelObject - should send the right message if any error got catched.', async () => {
	const channel = {
		"name": {
			"PT_BR": "Informações",
			"EN": "Info"
		},
		"type": "category",
		"permissionOverwrites": [],
		"child": []
	};
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			roles: {
				fetch: jest.fn(() => { throw 'ERRROU!'; })
			}
		}
    };
	const parent = {id: 'parentInfo'};

	await templateHandler.adjustChannelObject(channel, 'EN', message, parent);

	const messageSentSpy = jest.spyOn(message.channel, 'send');
	expect(messageSentSpy).toHaveBeenCalledWith('Discord API Error on getting roles.');
});

test('createChannels - expect to call functions the right number of times.', async () => {
	const channel = [
		{
            "name": {
				"PT_BR": "Informações",
				"EN": "Info"
			},
            "type": "category",
            "permissionOverwrites": [
				{
					"name": {
						"PT_BR": "Membro",
						"EN": "Member"
					},
					"allow": [],
					"deny": ["SEND_MESSAGES"]
				},
				{
					"name": {
						"PT_BR": "Moderação",
						"EN": "Mods"
					},
					"allow": ["SEND_MESSAGES"],
					"deny": []
				}
			],
            "child": [
                {
                    "name": {
						"PT_BR": "bem-vindo",
						"EN": "welcome"
					},
                    "type": "text",
					"permissionOverwrites": []
                },
                {
                    "name": {
						"PT_BR": "regras",
						"EN": "rules"
					},
                    "type": "text",
					"permissionOverwrites": []
                },
                {
                    "name": {
						"PT_BR": "ajuda",
						"EN": "need-help"
					},
                    "type": "text",
					"permissionOverwrites": []
                },
                {
                    "name": {
						"PT_BR": "anúncios",
						"EN": "announcements"
					},
                    "type": "text",
					"permissionOverwrites": []
                }
            ]
        }
	];
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			channels: {
				create: jest.fn(() => { return 42; })
			}
		}
    };

	const createChannelsSpy = jest.spyOn(templateHandler, 'createChannels');
	const channelConfigSpy = jest.spyOn(templateHandler, 'adjustChannelObject');
	const createSpy = jest.spyOn(message.guild.channels, 'create');

	await templateHandler.createChannels(channel, 1, 'EN', message, null, null);

	expect(createSpy).toHaveBeenCalledTimes(5);
	expect(channelConfigSpy).toHaveBeenCalledTimes(5);
	expect(createChannelsSpy).toHaveBeenCalledTimes(2);
});

test('createChannels - expect to call functions the right number of times when it is scalable.', async () => {
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			channels: {
				create: jest.fn(() => { return 42; })
			}
		}
    };

	const createChannelsSpy = jest.spyOn(templateHandler, 'createChannels');
	const channelConfigSpy = jest.spyOn(templateHandler, 'adjustChannelObject');
	const createSpy = jest.spyOn(message.guild.channels, 'create');

	await templateHandler.createChannels(DEFAULT_TEMPLATE_JSON.channels, 3, 'EN', message, null, null);

	expect(createSpy).toHaveBeenCalledTimes(25);
	expect(channelConfigSpy).toHaveBeenCalledTimes(25);
	expect(createChannelsSpy).toHaveBeenCalledTimes(8);
});

test('createChannels - should send the right message if any error got catched.', async () => {
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
		guild: {
			channels: {
				create: jest.fn(() => { throw 'ERRROU!'; })
			}
		}
    };

	await templateHandler.createChannels(DEFAULT_TEMPLATE_JSON.channels, 3, 'EN', message, null, null);

	const messageSentSpy = jest.spyOn(message.channel, 'send');
	expect(messageSentSpy).toHaveBeenCalledWith('Discord API Error on creating channels.');
});

test('executeTemplate - should call the right functions with the respectives params.', async () => {
	const templateName = 'default';
	const templateSize = 'small';
	const templateLang = 'en';
	const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        }
    };

	const selectedTemplateSpy = jest.spyOn(templateHandler, 'selectedTemplate');
	const selectedSizeSpy = jest.spyOn(templateHandler, 'selectedSize');
	const selectedLangSpy = jest.spyOn(templateHandler, 'selectedLang');
	const createRolesSpy = jest.spyOn(templateHandler, 'createRoles');
	const createChannelsSpy = jest.spyOn(templateHandler, 'createChannels');

	await templateHandler.executeTemplate(templateName, templateSize, templateLang, message);

	expect(selectedTemplateSpy).toHaveBeenCalledWith(templateName);
	expect(selectedSizeSpy).toHaveBeenCalledWith(templateSize);
	expect(selectedLangSpy).toHaveBeenCalledWith(templateLang);
	expect(createRolesSpy).toHaveBeenCalledTimes(1);
	expect(createChannelsSpy).toHaveBeenCalledTimes(1);
});
