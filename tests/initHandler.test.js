const { checkDiscordInfo } = require("../src/initHandler");

test('Check if func is working.', () => {
    expect(() => {checkDiscordInfo("ABC", "ABC")}).not.toThrowError("");
});

test('Check if func is throwing correctly.', () => {
	let throwMessage = "DISCORD_ID or DISCORD_TOKEN must be in the .env file.";

    expect(() => {checkDiscordInfo("ABC", "")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo("", "ABC")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo("", "")}).toThrowError(throwMessage);
});
