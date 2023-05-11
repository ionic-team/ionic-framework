import { doc, win } from '@utils/browser';
import { raf } from '@utils/helpers';

import { KeyboardResize, Keyboard } from '../native/keyboard';

/**
 * The element that resizes when the keyboard opens
 * is going to depend on the resize mode
 * which is why we check that here.
 */
const getResizeContainer = (resizeMode?: KeyboardResize): HTMLElement | null => {
  /**
   * If doc is undefined then we are
   * in an SSR environment, so the keyboard
   * adjustment does not apply.
   **/
  if (doc === undefined) {
    return null;
  }

  switch (resizeMode) {
    /**
     * We could pass `ion-app` as the resize
     * container for Body and Native resizes too,
     * but `ion-app` is not always defined.
     */
    case KeyboardResize.Ionic:
      return doc.querySelector('ion-app');
    case KeyboardResize.Body:
    /**
     * KeyboardResize.Native causes the window
     * to resize, but that means the body resizes too.
     */
    case KeyboardResize.Native:
      return doc.body;
    /**
     * There is no resize container if
     * webview resizing is disabled.
     */
    case KeyboardResize.None:
    default:
      return null;
  }
}

/**
 * Get the height of ion-app or body.
 * This is used for determining if the webview
 * has resized before the keyboard closed.
 * */
const getResizeContainerHeight = (resizeMode?: KeyboardResize) => {
  const containerElement = getResizeContainer(resizeMode);

  return containerElement === null ? 0 : containerElement.clientHeight;
};

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
  let initialContainerHeight: number;

  const init = async () => {
    const resizeOptions = await Keyboard.getResizeMode();
    const resizeMode = resizeOptions == undefined ? undefined : resizeOptions.mode;
    initialContainerHeight = getResizeContainerHeight(resizeMode);

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
      initialContainerHeight === 0 ||
      /**
       * If the keyboard is closed before the webview resizes initially
       *  then the webview will never resize.
       */
      initialContainerHeight === getResizeContainerHeight(resizeMode)
    ) {
      return;
    }

    /**
     * Get the resize container so we can
     * attach the ResizeObserver below to
     * the correct element.
     */
    const containerElement = getResizeContainer(resizeMode);
    if (containerElement === null) {
      return;
    }

    /**
     * Some part of the web content should resize
     * and we need to listen for a resize.
     */
    return new Promise((resolve) => {
      let initialResize = true;

      const callback = () => {
        /**
         * As per the spec, the ResizeObserver
         * will fire when observation starts if
         * the observed element is rendered and does not
         * have a size of 0 x 0. As a result, we want to ignore the
         * initial resize event.
         * https://www.w3.org/TR/resize-observer/#intro
         */
        if (initialResize) {
          initialResize = false;
          return;
        }

        ro.disconnect();

        /**
         * The raf ensures that this resolves the
         * frame after resizing has completed otherwise
         * there may still be a flicker.
         */
        raf(() => resolve());
      };

      /**
       * In Capacitor there can be delay between when the window
       * resizes and when the container element resizes, so we cannot
       * rely on a 'resize' event listener on the window.
       * Instead, we need to determine when the container
       * element resizes.
       */
      const ro = new ResizeObserver(callback);
      ro.observe(containerElement);
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
