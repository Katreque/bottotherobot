const { checkPrefix } = require("../src/prefixHandler");

test('Check if func is working.', () => {
    expect(() => {checkPrefix("-")}).not.toThrowError("");
});

test('Check if func is throwing correctly.', () => {
	let throwMessage = 'This bot must configure a prefix in .env file.';

    expect(() => {checkPrefix("")}).toThrowError(throwMessage);
});