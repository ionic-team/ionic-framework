import { config } from '@global/config';

import { printIonError, printIonWarning } from '../index';

describe('Logging', () => {
  describe('#printIonWarning', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn');
      // Suppress console.warn output from polluting the test output
      consoleWarnSpy.mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    describe('when the logLevel configuration is not set', () => {
      it('logs a warning to the console', () => {
        config.set('logLevel', undefined);

        printIonWarning('This is a warning message');

        expect(consoleWarnSpy).toHaveBeenCalledWith('[Ionic Warn]: This is a warning message');
      });
    });

    describe("when the logLevel configuration is set to 'ERROR'", () => {
      it('logs a warning to the console', () => {
        config.set('logLevel', 'ERROR');

        printIonWarning('This is a warning message');

        expect(consoleWarnSpy).toHaveBeenCalledWith('[Ionic Warn]: This is a warning message');
      });
    });

    describe("when the logLevel configuration is set to 'WARN'", () => {
      it('logs a warning to the console', () => {
        config.set('logLevel', 'WARN');

        printIonWarning('This is a warning message');

        expect(consoleWarnSpy).toHaveBeenCalledWith('[Ionic Warn]: This is a warning message');
      });
    });

    describe("when the logLevel configuration is set to 'OFF'", () => {
      it('does not log a warning to the console', () => {
        config.set('logLevel', 'OFF');

        printIonWarning('This is a warning message');

        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('#printIonError', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error');
      // Suppress console.error output from polluting the test output
      consoleErrorSpy.mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    describe('when the logLevel configuration is not set', () => {
      it('logs an error to the console', () => {
        config.set('logLevel', undefined);

        printIonError('This is an error message');

        expect(consoleErrorSpy).toHaveBeenCalledWith('[Ionic Error]: This is an error message');
      });
    });

    describe("when the logLevel configuration is set to 'ERROR'", () => {
      it('logs an error to the console', () => {
        config.set('logLevel', 'ERROR');

        printIonError('This is an error message');

        expect(consoleErrorSpy).toHaveBeenCalledWith('[Ionic Error]: This is an error message');
      });
    });

    describe("when the logLevel configuration is set to 'WARN'", () => {
      it('does not log an error to the console', () => {
        config.set('logLevel', 'WARN');

        printIonError('This is an error message');

        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the logLevel configuration is set to 'OFF'", () => {
      it('does not log an error to the console', () => {
        config.set('logLevel', 'OFF');

        printIonError('This is an error message');

        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });
    });
  });
});
