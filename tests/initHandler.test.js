const fs = require('fs');
const { checkDiscordInfo, checkIfExistsConfigFile, checkIfHadErrorWrittingFile } = require("../src/initHandler");

jest.mock('fs');

beforeEach(() => {
	fs.writeFile.mockClear();
});

test('checkDiscordInfo - Check if func is defined.', () => {
    expect(checkDiscordInfo).toBeDefined();
});

test('checkDiscordInfo - If all 3 params are defined, should not throw.', () => {
    expect(() => {checkDiscordInfo("ABC", "ABC", "ABC")}).not.toThrowError("");
});

test('checkDiscordInfo - Check if func is throwing correctly.', () => {
	let throwMessage = 'DISCORD_ID, DISCORD_TOKEN and GUILD_ID must be in the .env file.';

    expect(() => {checkDiscordInfo("ABC", "", "")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo(undefined, "ABC", "")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo("", null, "ABC")}).toThrowError(throwMessage);
	expect(() => {checkDiscordInfo(undefined, undefined, undefined)}).toThrowError(throwMessage);
});

test('checkIfExistsConfigFile - Check if func is defined.', () => {
	expect(checkIfExistsConfigFile).toBeDefined();
})

test('checkIfExistsConfigFile - If config.json exists, does nothing.', () => {
	fs.existsSync.mockReturnValue(true);

	checkIfExistsConfigFile();
	expect(fs.writeFileSync).not.toHaveBeenCalled();
})

test('checkIfExistsConfigFile - If config.json doesnt exist, it creates one.', () => {
	fs.existsSync.mockReturnValue(false);

	checkIfExistsConfigFile();
	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith('config.json', '{\"user_joined_channel\":\"\",\"user_left_channel\":\"\"}', checkIfHadErrorWrittingFile);
})

test('checkIfHadErrorWrittingFile - Check if func is defined.', () => {
	expect(checkIfHadErrorWrittingFile).toBeDefined();
})

test('checkIfHadErrorWrittingFile - If has no error, shouldnt Throw.', () => {
	expect(() => {
		checkIfHadErrorWrittingFile(false)
	}).not.toThrow();
})

test('checkIfHadErrorWrittingFile - If has error, should Throw.', () => {
	expect(() => {
		checkIfHadErrorWrittingFile(true)
	}).toThrow();
})
