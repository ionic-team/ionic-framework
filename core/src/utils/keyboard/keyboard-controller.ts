import { win } from '../window';

/**
 * Creates a controller that tracks and reacts to opening or closing the keyboard.
 *
 * @internal
 * @param keyboardChangeCallback A function to call when the keyboard opens or closes.
 */
export const createKeyboardController = (
  keyboardChangeCallback?: (keyboardOpen: boolean, lifecycle: KeyboardLifecycle) => void
): KeyboardController => {
  let keyboardWillShowHandler: (() => void) | undefined;
  let keyboardDidShowHandler: (() => void) | undefined;
  let keyboardWillHideHandler: (() => void) | undefined;
  let keyboardDidHideHandler: (() => void) | undefined;
  let keyboardVisible: boolean;

  const init = () => {
    keyboardWillShowHandler = () => {
      keyboardVisible = false;
      if (keyboardChangeCallback) keyboardChangeCallback(keyboardVisible, KeyboardLifecycle.WillShow);
    };

    keyboardDidShowHandler = () => {
      keyboardVisible = true;
      if (keyboardChangeCallback) keyboardChangeCallback(keyboardVisible, KeyboardLifecycle.DidShow);
    };

    keyboardWillHideHandler = () => {
      keyboardVisible = true;
      if (keyboardChangeCallback) keyboardChangeCallback(keyboardVisible, KeyboardLifecycle.WillHide);
    };

    keyboardDidHideHandler = () => {
      keyboardVisible = false;
      if (keyboardChangeCallback) keyboardChangeCallback(keyboardVisible, KeyboardLifecycle.DidHide);
    };

    win?.addEventListener('keyboardWillShow', keyboardWillShowHandler);
    win?.addEventListener('keyboardDidShow', keyboardDidShowHandler);
    win?.addEventListener('keyboardWillHide', keyboardWillHideHandler);
    win?.addEventListener('keyboardDidHide', keyboardDidHideHandler);
  };

  const destroy = () => {
    win?.removeEventListener('keyboardWillShow', keyboardWillShowHandler!);
    win?.removeEventListener('keyboardDidShow', keyboardDidShowHandler!);
    win?.removeEventListener('keyboardWillShow', keyboardWillShowHandler!);
    win?.removeEventListener('keyboardDidHide', keyboardDidHideHandler!);

    keyboardWillShowHandler = keyboardDidShowHandler = keyboardWillHideHandler = keyboardDidHideHandler = undefined;
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

export enum KeyboardLifecycle {
  WillShow = 'willShow',
  DidShow = 'didShow',
  WillHide = 'willHide',
  DidHide = 'didHide',
}
