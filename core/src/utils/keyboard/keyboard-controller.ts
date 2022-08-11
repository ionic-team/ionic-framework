/**
 * Creates a controller that tracks and reacts to opening or closing the keyboard.
 * 
 * @internal
 * @param keyboardChangeCallback A function to call when the keyboard opens or closes.
 */
export const createKeyboardController = (
  keyboardChangeCallback?: (keyboardOpen: boolean) => void
) => {
  let keyboardWillShowHandler: (() => void) | undefined;
  let keyboardWillHideHandler: (() => void) | undefined;
  let keyboardVisible: boolean;

  const init = () => {
    if (typeof (window as any) !== 'undefined') {
      keyboardWillShowHandler = () => {
        keyboardVisible = true;
        if (keyboardChangeCallback) keyboardChangeCallback(true);
      };

      keyboardWillHideHandler = () => {
        keyboardVisible = false;
        if (keyboardChangeCallback) keyboardChangeCallback(false);
      };

      window.addEventListener('keyboardWillShow', keyboardWillShowHandler);
      window.addEventListener('keyboardWillHide', keyboardWillHideHandler);
    }
  };

  const destroy = () => {
    if (typeof (window as any) !== 'undefined') {
      window.removeEventListener('keyboardWillShow', keyboardWillShowHandler!);
      window.removeEventListener('keyboardWillHide', keyboardWillHideHandler!);

      keyboardWillShowHandler = keyboardWillHideHandler = undefined;
    }
  };

  const isKeyboardVisible = () => keyboardVisible;

  return { init, destroy, isKeyboardVisible };
};

export type KeyboardController = {
  init: () => void,
  destroy: () => void,
  isKeyboardVisible: () => boolean
};