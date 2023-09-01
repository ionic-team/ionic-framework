import type { StatusBarPlugin, Style as StatusBarStyle } from '@capacitor/status-bar';

import { getCapacitor } from './capacitor';

interface StyleOptions {
  style: StatusBarStyle;
}

export enum Style {
  Dark = 'DARK',
  Light = 'LIGHT',
  Default = 'DEFAULT',
}

export const StatusBar = {
  getEngine(): StatusBarPlugin | undefined {
    const capacitor = getCapacitor();

    if (capacitor?.isPluginAvailable('StatusBar')) {
      return capacitor.Plugins.StatusBar as StatusBarPlugin;
    }
    return undefined;
  },
  // TODO FW-4696 Remove supportDefaultStatusBarStyle in Ionic v8
  supportsDefaultStatusBarStyle() {
    const capacitor = getCapacitor() as any;
    /**
     * The 'DEFAULT' status bar style was added
     * to the @capacitor/status-bar plugin in Capacitor 3.
     * PluginHeaders is only supported in Capacitor 3+,
     * so we can use this to detect Capacitor 3.
     */
    return !!capacitor?.PluginHeaders;
  },
  setStyle(options: StyleOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.setStyle(options);
  },
  getStyle: async function (): Promise<StatusBarStyle> {
    const engine = this.getEngine();
    if (!engine) {
      return Style.Default;
    }
    const { style } = await engine.getInfo();
    return style;
  },
};
