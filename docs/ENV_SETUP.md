# .env Setup

A .env file should be create on the root of the project. It need to look like this:

```
DISCORD_ID=valuehere
DISCORD_TOKEN=valuehere
GUILD_ID=valuehere
```

Your Discord bot info can be found on the [Discord Developers Portal](https://discord.com/developers). The DISCORD_ID is the APPLICATION ID on the *General Information* tab. The DISCORD_TOKEN is the TOKEN on the *Bot* tab. Be aware that your token is sensitive data, so be careful.

In order to get the GUILD_ID, you must enable the [Discord Developer Mode](https://discord.com/developers/docs/game-sdk/store#application-test-mode). After enabling it, right click the icon of your server and select *Copy ID*.

Now replaced the 'valuehere' inside the .env file with all information gathered.
