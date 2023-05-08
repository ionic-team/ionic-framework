import { raf } from '@utils/helpers';
import { win } from '@utils/window';

import { KeyboardResize, Keyboard } from '../native/keyboard';

/**
 * Creates a controller that tracks and reacts to opening or closing the keyboard.
 *
 * @internal
 * @param keyboardChangeCallback A function to call when the keyboard opens or closes.
 */
export const createKeyboardController = async (
  keyboardChangeCallback?: (keyboardOpen: boolean, resizePromise?: Promise<void>) => void
): Promise<KeyboardController> => {
  let keyboardWillShowHandler: (() => void) | undefined;
  let keyboardWillHideHandler: (() => void) | undefined;
  let keyboardVisible: boolean;
  const windowHeight = win?.innerHeight;

  const init = async () => {
    const resizeOptions = await Keyboard.getResizeMode();
    const resizeMode = resizeOptions == undefined ? undefined : resizeOptions.mode;

    keyboardWillShowHandler = () => {
      keyboardVisible = true;
      fireChangeCallback(keyboardVisible, resizeMode);
    };

    keyboardWillHideHandler = () => {
      keyboardVisible = false;
      fireChangeCallback(keyboardVisible, resizeMode);
    };

    win?.addEventListener('keyboardWillShow', keyboardWillShowHandler);
    win?.addEventListener('keyboardWillHide', keyboardWillHideHandler);
  };

  const fireChangeCallback = (state: boolean, resizeMode: KeyboardResize | undefined) => {
    if (keyboardChangeCallback) {
      keyboardChangeCallback(state, createResizePromiseIfNeeded(resizeMode));
    }
  };

  /**
   * Code responding to keyboard lifecycles may need
   * to show/hide content once the webview has
   * resized as a result of the keyboard showing/hiding.
   * resizePromise provides a way for code to wait for the
   * resize event that was triggered as a result of the keyboard.
   */
  const createResizePromiseIfNeeded = (resizeMode: KeyboardResize | undefined): Promise<void> | undefined => {
    if (
      /**
       * If the resize mode is undefined then we cannot safely
       * assume that the web content will resize. This will
       * be the case if an app is deployed to a mobile browser/PWA
       * as the native Capacitor keyboard plugin will not be available.
       *
       * If the resize mode is "None" then the webview is configured
       * to never resize when the keyboard opens/closes.
       */
      resizeMode === undefined ||
      resizeMode === KeyboardResize.None ||
      /**
       * If we are in an SSR environment then there is
       * no window to resize.
       */
      win === undefined ||
      windowHeight === undefined ||
      /**
       * If the keyboard is closed before the webview resizes initially
       *  then the webview will never resize.
       */
      windowHeight === win!.innerHeight
    ) {
      return;
    }

    /**
     * Otherwise, the webview should resize
     * and we need to listen for that event.
     */
    return new Promise((resolve) => {
      let timeout: ReturnType<typeof setTimeout> | undefined;
      const callback = () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeout = undefined;
        }
        /**
         * The raf ensures that this resolves the
         * frame after resizing has completed otherwise
         * there may still be a flicker.
         */
        raf(() => resolve());
      };
      win?.addEventListener('resize', callback, { once: true });

      /**
       * In the event that the `resize` event never fires,
       * create a fallback of 1000ms so code does not get stuck
       * in an inconsistent state.
       */
      timeout = setTimeout(callback, 1000);
    });
  };

  const destroy = () => {
    win?.removeEventListener('keyboardWillShow', keyboardWillShowHandler!);
    win?.removeEventListener('keyboardWillHide', keyboardWillHideHandler!);

    keyboardWillShowHandler = keyboardWillHideHandler = undefined;
  };

  const isKeyboardVisible = () => keyboardVisible;

  await init();
  return { init, destroy, isKeyboardVisible };
};

export type KeyboardController = {
  init: () => void;
  destroy: () => void;
  isKeyboardVisible: () => boolean;
};
