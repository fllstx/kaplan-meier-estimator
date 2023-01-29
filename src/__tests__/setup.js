/* eslint-disable no-undef */
global.console = {
	...console,
	warn: jest.fn(),
};
