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
