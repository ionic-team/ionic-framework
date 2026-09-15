import { createDebugLogger } from '../debug';

/** Core swaps `Ionic.config` for a `Config` instance in `initialize()`, so a `get` stub is enough here. */
const setLogLevel = (logLevel?: string) => {
  (window as any).Ionic = { config: { get: (key: string) => (key === 'logLevel' ? logLevel : undefined) } };
};

describe('debug logging', () => {
  let consoleLogSpy: jest.SpyInstance;
  let debug: ReturnType<typeof createDebugLogger>;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    delete (window as any).Ionic;
    debug = createDebugLogger('react-router');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    delete (window as any).Ionic;
  });

  describe('gating', () => {
    it('should stay silent before Ionic has initialized', () => {
      debug('SomeEvent');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should stay silent at the default log level', () => {
      setLogLevel(undefined);

      debug('SomeEvent');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should stay silent at log levels below DEBUG', () => {
      ['OFF', 'ERROR', 'WARN'].forEach((logLevel) => {
        setLogLevel(logLevel);

        debug('SomeEvent');

        expect(consoleLogSpy).not.toHaveBeenCalled();
      });
    });

    it('should log at the DEBUG log level', () => {
      setLogLevel('DEBUG');

      debug('SomeEvent');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should accept a log level in any casing, since query parameters are raw strings', () => {
      setLogLevel('debug');

      debug('SomeEvent');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should track the log level changing after the logger is created', () => {
      setLogLevel('WARN');
      debug('SomeEvent');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      setLogLevel('DEBUG');
      debug('SomeEvent');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('output', () => {
    it('should not build a payload while disabled', () => {
      const getData = jest.fn(() => ({ some: 'data' }));

      debug('SomeEvent', getData);

      expect(getData).not.toHaveBeenCalled();
    });

    it('should log a namespaced event with its serialized payload', () => {
      setLogLevel('DEBUG');

      debug('SomeEvent', () => ({ some: 'data' }));

      expect(consoleLogSpy).toHaveBeenCalledWith('[Ionic Debug]: [react-router] - SomeEvent', '{"some":"data"}');
    });

    it('should log events that carry no payload', () => {
      setLogLevel('DEBUG');

      debug('SomeEvent');

      expect(consoleLogSpy).toHaveBeenCalledWith('[Ionic Debug]: [react-router] - SomeEvent');
    });

    it('should keep logging when a payload cannot be serialized', () => {
      setLogLevel('DEBUG');
      const circular: any = {};
      circular.self = circular;

      debug('SomeEvent', () => circular);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Ionic Debug]: [react-router] - SomeEvent',
        '[unserializable payload]'
      );
    });
  });
});
