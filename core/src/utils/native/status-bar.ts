import { win } from '../window';

interface StyleOptions {
  style: Style;
}

export enum Style {
  Dark = 'DARK',
  Light = 'LIGHT',
  Default = 'DEFAULT',
}

export const StatusBar = {
  getEngine() {
    return (win as any)?.Capacitor?.isPluginAvailable('StatusBar') && (win as any)?.Capacitor.Plugins.StatusBar;
  },
  supportsDefaultStatusBarStyle() {
    /**
     * The 'DEFAULT' status bar style was added
     * to the @capacitor/status-bar plugin in Capacitor 3.
     * PluginHeaders is only supported in Capacitor 3+,
     * so we can use this to detect Capacitor 3.
     */
    return !!(win as any)?.Capacitor?.PluginHeaders;
  },
  setStyle(options: StyleOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.setStyle(options);
  },
  getStyle: async function (): Promise<Style> {
    const engine = this.getEngine();
    if (!engine) {
      return Style.Default;
    }
    const { style } = await engine.getInfo();
    return style;
  },
};
