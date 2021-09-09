const fs = require('fs');
const { checkDiscordInfo, checkIfExistsConfigFile } = require("../src/initHandler");

jest.mock('fs');

beforeEach(() => {
	fs.writeFile.mockClear();
});

test('checkDiscordInfo - Check if func is defined.', () => {
    expect(() => {checkDiscordInfo("ABC", "ABC", "ABC")}).not.toThrowError("");
});

test('checkDiscordInfo - Check if func is throwing correctly.', () => {
	let throwMessage = 'DISCORD_ID, DISCORD_TOKEN and GUILD_ID must be in the .env file.';

    expect(() => {checkDiscordInfo("ABC", "", "")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo("", "ABC", "")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo("", "", "ABC")}).toThrowError(throwMessage);
});

test('checkIfExistsConfigFile - Check if func is defined.', () => {
	expect(() => {checkIfExistsConfigFile()}).not.toThrowError("");
})

test('checkIfExistsConfigFile - If config.json exists, does nothing.', () => {
	fs.existsSync.mockReturnValue(true);

	checkIfExistsConfigFile();
	expect(fs.writeFile).not.toHaveBeenCalled();
})

test('checkIfExistsConfigFile - If config.json doesnt exist, it creates one.', () => {
	fs.existsSync.mockReturnValue(false);

	checkIfExistsConfigFile();
	expect(fs.writeFile).toHaveBeenCalledTimes(1);
})
