import { win } from '../window';

/**
 * Creates a controller that tracks and reacts to opening or closing the keyboard.
 *
 * @internal
 * @param keyboardChangeCallback A function to call when the keyboard opens or closes.
 */
export const createKeyboardController = (
  keyboardChangeCallback?: (keyboardOpen: boolean) => void
): KeyboardController => {
  let keyboardWillShowHandler: (() => void) | undefined;
  let keyboardWillHideHandler: (() => void) | undefined;
  let keyboardVisible: boolean;

  const init = () => {
    keyboardWillShowHandler = () => {
      keyboardVisible = true;
      if (keyboardChangeCallback) keyboardChangeCallback(true);
    };

    keyboardWillHideHandler = () => {
      keyboardVisible = false;
      if (keyboardChangeCallback) keyboardChangeCallback(false);
    };

    win?.addEventListener('keyboardWillShow', keyboardWillShowHandler);
    win?.addEventListener('keyboardWillHide', keyboardWillHideHandler);
  };

  const destroy = () => {
    win?.removeEventListener('keyboardWillShow', keyboardWillShowHandler!);
    win?.removeEventListener('keyboardWillHide', keyboardWillHideHandler!);

    keyboardWillShowHandler = keyboardWillHideHandler = undefined;
  };

  const isKeyboardVisible = () => keyboardVisible;

  init();
  return { init, destroy, isKeyboardVisible };
};

export type KeyboardController = {
  init: () => void;
  destroy: () => void;
  isKeyboardVisible: () => boolean;
};
