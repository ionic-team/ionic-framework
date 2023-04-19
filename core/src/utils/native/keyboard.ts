import { win } from '../window';

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
    if (!engine || !engine.getResizeMode) {
      return Promise.resolve(undefined);
    }

    return engine.getResizeMode();
  },
};
