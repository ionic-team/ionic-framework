import { StatusBar, Style } from '../status-bar';

const createStatusBarPlugin = () => ({
  setStyle: jest.fn(),
  getInfo: jest.fn().mockResolvedValue({ style: Style.Light, visible: true, overlays: false }),
});

/**
 * Installs a fake window.Capacitor. `plugins` are registered under
 * `Capacitor.Plugins`, and `isPluginAvailable` reports only the
 * names listed in `available`.
 */
const mockCapacitor = ({ plugins, available }: { plugins: Record<string, unknown>; available: string[] }) => {
  (window as any).Capacitor = {
    isPluginAvailable: (name: string) => available.includes(name),
    Plugins: plugins,
  };
};

/**
 * Assertions use raw style strings rather than the Style enum so they
 * pin the values the native plugins actually receive.
 */
describe('StatusBar', () => {
  afterEach(() => {
    delete (window as any).Capacitor;
  });

  describe('when the StatusBar plugin is available', () => {
    let statusBarPlugin: ReturnType<typeof createStatusBarPlugin>;

    beforeEach(() => {
      statusBarPlugin = createStatusBarPlugin();
      mockCapacitor({ plugins: { StatusBar: statusBarPlugin }, available: ['StatusBar'] });
    });

    it('should forward the style to the StatusBar plugin', () => {
      StatusBar.setStyle({ style: Style.Dark });

      expect(statusBarPlugin.setStyle.mock.calls).toStrictEqual([[{ style: 'DARK' }]]);
    });

    it('should resolve getStyle to the style reported by the StatusBar plugin', async () => {
      await expect(StatusBar.getStyle()).resolves.toBe('LIGHT');
    });
  });

  describe('when Capacitor is present but the StatusBar plugin is not registered', () => {
    beforeEach(() => {
      mockCapacitor({ plugins: {}, available: [] });
    });

    it('should not throw when setting the style', () => {
      expect(() => StatusBar.setStyle({ style: Style.Dark })).not.toThrow();
    });

    it('should resolve getStyle to DEFAULT', async () => {
      await expect(StatusBar.getStyle()).resolves.toBe('DEFAULT');
    });
  });

  describe('when the StatusBar plugin is registered but not available', () => {
    let statusBarPlugin: ReturnType<typeof createStatusBarPlugin>;

    beforeEach(() => {
      /**
       * The plugin is registered under Plugins but not available natively,
       * so the wrapper must rely on isPluginAvailable rather than on the
       * presence of Plugins.StatusBar.
       */
      statusBarPlugin = createStatusBarPlugin();
      mockCapacitor({ plugins: { StatusBar: statusBarPlugin }, available: [] });
    });

    it('should not call the StatusBar plugin when setting the style', () => {
      expect(() => StatusBar.setStyle({ style: Style.Dark })).not.toThrow();

      expect(statusBarPlugin.setStyle).not.toHaveBeenCalled();
    });

    it('should resolve getStyle to DEFAULT without querying the StatusBar plugin', async () => {
      await expect(StatusBar.getStyle()).resolves.toBe('DEFAULT');

      expect(statusBarPlugin.getInfo).not.toHaveBeenCalled();
    });
  });

  describe('when only the SystemBars plugin is available', () => {
    let systemBarsPlugin: { setStyle: jest.Mock };

    beforeEach(() => {
      systemBarsPlugin = { setStyle: jest.fn() };
      mockCapacitor({ plugins: { SystemBars: systemBarsPlugin }, available: ['SystemBars'] });
    });

    it('should style only the status bar through the SystemBars plugin', () => {
      StatusBar.setStyle({ style: Style.Dark });

      expect(systemBarsPlugin.setStyle.mock.calls).toStrictEqual([[{ style: 'DARK', bar: 'StatusBar' }]]);
    });

    it('should resolve getStyle to DEFAULT', async () => {
      await expect(StatusBar.getStyle()).resolves.toBe('DEFAULT');
    });
  });

  describe('when both the StatusBar and SystemBars plugins are available', () => {
    let statusBarPlugin: ReturnType<typeof createStatusBarPlugin>;
    let systemBarsPlugin: { setStyle: jest.Mock };

    beforeEach(() => {
      statusBarPlugin = createStatusBarPlugin();
      systemBarsPlugin = { setStyle: jest.fn() };
      mockCapacitor({
        plugins: { StatusBar: statusBarPlugin, SystemBars: systemBarsPlugin },
        available: ['StatusBar', 'SystemBars'],
      });
    });

    it('should only call the StatusBar plugin', async () => {
      StatusBar.setStyle({ style: Style.Dark });

      await expect(StatusBar.getStyle()).resolves.toBe('LIGHT');
      expect(statusBarPlugin.setStyle.mock.calls).toStrictEqual([[{ style: 'DARK' }]]);
      expect(systemBarsPlugin.setStyle).not.toHaveBeenCalled();
    });
  });

  describe('when Capacitor is not present', () => {
    it('should not throw when setting the style', () => {
      expect(() => StatusBar.setStyle({ style: Style.Dark })).not.toThrow();
    });

    it('should resolve getStyle to DEFAULT', async () => {
      await expect(StatusBar.getStyle()).resolves.toBe('DEFAULT');
    });
  });
});
