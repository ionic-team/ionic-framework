import type { StatusBarPlugin, Style as StatusBarStyle } from '@capacitor/status-bar';

import { win } from '../browser';

import { capacitor } from './capacitor';


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
    if (capacitor?.isPluginAvailable('StatusBar')) {
      return capacitor.Plugins.StatusBar as StatusBarPlugin;
    }
    return undefined;
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
  getStyle: async function (): Promise<StatusBarStyle> {
    const engine = this.getEngine();
    if (!engine) {
      return Style.Default;
    }
    const { style } = await engine.getInfo();
    return style;
  },
};
