import { win } from '../browser';

import type { NativePluginError } from './native-interface';

// Interfaces source: https://capacitorjs.com/docs/apis/keyboard#interfaces
export interface KeyboardResizeOptions {
  mode: KeyboardResize;
}

export enum KeyboardResize {
  Body = 'body',
  Ionic = 'ionic',
  Native = 'native',
  None = 'none',
}

export const Keyboard = {
  getEngine() {
    return (win as any)?.Capacitor?.isPluginAvailable('Keyboard') && (win as any)?.Capacitor.Plugins.Keyboard;
  },
  getResizeMode(): Promise<KeyboardResizeOptions | undefined> {
    const engine = this.getEngine();
    if (!engine?.getResizeMode) {
      return Promise.resolve(undefined);
    }
    return engine.getResizeMode().catch((e: NativePluginError) => {
      if (e.code === 'UNIMPLEMENTED') {
        // If the native implementation is not available
        // we treat it the same as if the plugin is not available.
        return undefined;
      }
      throw e;
    });
  },
};
