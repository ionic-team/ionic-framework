import { createKeyboardController } from '../keyboard-controller';

describe('Keyboard Controller', () => {
  it('should update isKeyboardVisible', () => {
    const keyboardCtrl = createKeyboardController();

    window.dispatchEvent(new Event('keyboardWillShow'));
    expect(keyboardCtrl.isKeyboardVisible()).toBe(true);

    window.dispatchEvent(new Event('keyboardWillHide'));
    expect(keyboardCtrl.isKeyboardVisible()).toBe(false);
  });

  it('should run the callback', () => {
    const callbackMock = jest.fn();
    createKeyboardController(callbackMock);

    window.dispatchEvent(new Event('keyboardWillShow'));
    expect(callbackMock).toHaveBeenCalledWith(true);

    window.dispatchEvent(new Event('keyboardWillHide'));
    expect(callbackMock).toHaveBeenCalledWith(false);
  });
});
