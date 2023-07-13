import type { CapacitorException } from '@capacitor/core';
import type { KeyboardPlugin, KeyboardResizeOptions } from '@capacitor/keyboard';

import { getCapacitor } from './capacitor';
import { ExceptionCode } from './native-interface';

export enum KeyboardResize {
  /**
   * Only the `body` HTML element will be resized.
   * Relative units are not affected, because the viewport does not change.
   *
   * @since 1.0.0
   */
  Body = 'body',
  /**
   * Only the `ion-app` HTML element will be resized.
   * Use it only for Ionic Framework apps.
   *
   * @since 1.0.0
   */
  Ionic = 'ionic',
  /**
   * The whole native Web View will be resized when the keyboard shows/hides.
   * This affects the `vh` relative unit.
   *
   * @since 1.0.0
   */
  Native = 'native',
  /**
   * Neither the app nor the Web View are resized.
   *
   * @since 1.0.0
   */
  None = 'none',
}

export const Keyboard = {
  getEngine(): KeyboardPlugin | undefined {
    const capacitor = getCapacitor();

    if (capacitor?.isPluginAvailable('Keyboard')) {
      return capacitor.Plugins.Keyboard as KeyboardPlugin;
    }
    return undefined;
  },
  getResizeMode(): Promise<KeyboardResizeOptions | undefined> {
    const engine = this.getEngine();
    if (!engine?.getResizeMode) {
      return Promise.resolve(undefined);
    }
    return engine.getResizeMode().catch((e: CapacitorException) => {
      if (e.code === ExceptionCode.Unimplemented) {
        // If the native implementation is not available
        // we treat it the same as if the plugin is not available.
        return undefined;
      }
      throw e;
    });
  },
};
