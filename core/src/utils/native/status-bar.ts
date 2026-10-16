import type { SystemBars } from '@capacitor/core';
import type { StatusBarPlugin, Style as StatusBarStyle } from '@capacitor/status-bar';

import { getCapacitor } from './capacitor';

type SystemBarsPlugin = typeof SystemBars;
type SystemBarsStyleOptions = Parameters<SystemBarsPlugin['setStyle']>[0];

interface StyleOptions {
  style: StatusBarStyle;
}

export enum Style {
  Dark = 'DARK',
  Light = 'LIGHT',
  Default = 'DEFAULT',
}

/**
 * The external @capacitor/status-bar plugin is preferred because it can
 * report the current style. Capacitor 8+ ships the built-in SystemBars
 * plugin, which is used when the external plugin is not installed.
 */
type ResolvedEngine =
  | { kind: 'StatusBar'; plugin: StatusBarPlugin }
  | { kind: 'SystemBars'; plugin: SystemBarsPlugin }
  | undefined;

const resolveEngine = (): ResolvedEngine => {
  const capacitor = getCapacitor();

  if (capacitor?.isPluginAvailable('StatusBar')) {
    return { kind: 'StatusBar', plugin: capacitor.Plugins.StatusBar as StatusBarPlugin };
  }
  if (capacitor?.isPluginAvailable('SystemBars')) {
    return { kind: 'SystemBars', plugin: capacitor.Plugins.SystemBars as SystemBarsPlugin };
  }
  return undefined;
};

export const StatusBar = {
  getEngine(): StatusBarPlugin | SystemBarsPlugin | undefined {
    return resolveEngine()?.plugin;
  },
  setStyle(options: StyleOptions) {
    const engine = resolveEngine();
    if (!engine) {
      return;
    }

    if (engine.kind === 'SystemBars') {
      /**
       * Only restyle the status bar so the navigation/gesture bar is
       * left untouched. String literals are used instead of Capacitor's
       * runtime enums to avoid importing @capacitor/core at runtime.
       */
      engine.plugin.setStyle({ style: options.style, bar: 'StatusBar' } as unknown as SystemBarsStyleOptions);
      return;
    }

    engine.plugin.setStyle(options);
  },
  getStyle: async function (): Promise<StatusBarStyle> {
    const engine = resolveEngine();
    /**
     * SystemBars has no getter, so DEFAULT (device appearance) is the
     * style restored on dismiss.
     */
    if (engine?.kind !== 'StatusBar') {
      return Style.Default;
    }
    const { style } = await engine.plugin.getInfo();
    return style;
  },
};
