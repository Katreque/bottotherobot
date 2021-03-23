const { handleCommand } = require("../src/commandsHandler");
const botPrefix = '-' // This bot prefix is just an imaginary thing for science.

test('Check if command is recognized and author is admin.', () => {
    const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
        member: {  
            hasPermission: jest.fn(() => { return true; })
        },
        content: '-hello'
    }
    handleCommand(message, botPrefix);
    expect(message.channel.send).toHaveBeenCalledWith('Hello there. General Kenobi!');
});

test('Check if command is not recognized and user is admin', () => {
    const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
        member: {  
            hasPermission: jest.fn(() => { return true; })
        },
        content: '-cleitin'
    }
    handleCommand(message, botPrefix);
    expect(message.channel.send).toHaveBeenCalledWith('Command not recognized.');
});

test('Check if command is recognized and user is not admin.', () => {
    const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
        member: {  
            hasPermission: jest.fn(() => { return false; })
        },
        content: '-hello'
    }
    handleCommand(message, botPrefix);
    expect(message.channel.send).toHaveBeenCalledWith('You must be an Admin to perform this command.');
});

test('ASIKJDFAISYUASFK.', () => {
    const message = {
        channel: {
            send: jest.fn(() => { return 42; })
        },
        member: {  
            hasPermission: jest.fn(() => { return true; })
        },
        content: '!hello'
    }
    handleCommand(message, botPrefix);
    expect(message.channel.send).not.toHaveBeenCalled();
});