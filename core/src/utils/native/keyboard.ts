import { isPlatform } from '@utils/platform';

import { win } from '../browser';

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
    if (!isPlatform('ios') || !engine?.getResizeMode) {
      // getResizeMode is only available on iOS
      // see: https://ionicframework.com/docs/native/keyboard#getresizemode
      return Promise.resolve(undefined);
    }

    return engine.getResizeMode();
  },
};
