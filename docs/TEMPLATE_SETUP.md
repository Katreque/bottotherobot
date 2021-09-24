# Template Setup

The template is a JSON with an array of **Roles** and a array of **Channels**. It's located on *src/templates*. It'll always run the default.json template.

## Role

Role object:
```
{
	"name": string,
	"color": string,
	"permissions": string,
	"hoist": boolean,
	"mentionable": boolean,
	"gettable": boolean
}
```

- name: Name of the **role**.
- color: Display color of the **role**. (hexadecimal)
- permissions: Permission integer. This value can be obtained using [Discord Permission Calculator](https://discord.com/developers) on the Bot tab.
- hoist: If the **role** should be shown separately on the server members list.
- mentionable: If the **role** can be mentioned.
- gettable: If a user can get the **role** through command.

## Channel

Channel object:
```
{
	"name": string,
	"type": string,
	"permissionOverwrites": array of [permissions](#permission),
	"child": array of channels,
	"userJoinedChannel": boolean,
	"userLeftChannel": boolean,
}
```

- name: Name of the **channel**.
- type: [Type of the **channel**](https://discord.com/developers/docs/resources/channel#channel-object-channel-types).
- permissionOverwrites: Roles' permission for this channel.
- child: If the channel is a **Category**, adds these channels as it's children.
- userJoinedChannel: If the channel should be notified if a **new user** joined the server.
- userLeftChannel: If the channel should be notified if a **user left** the server.

## Permission

Permission object:
```
{
	"name": string,
	"allow": array of strings,
	"deny": array of strings
}
```
- name: Name of the **role** that permissions will be applied.
- allow: Permission's name that will be allowed.
- deny: Permission's name that will be denied.

All permissions are [listed here](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags).

### Examples

Template examples can be found [here](./src/templates).
