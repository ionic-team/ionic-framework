import { createKeyboardController } from '../keyboard-controller';

describe('Keyboard Controller', () => {
  it('should update isKeyboardVisible', () => {
    const keyboardCtrl = createKeyboardController();

    window.dispatchEvent(new Event('keyboardWillShow'));
    expect(keyboardCtrl.isKeyboardVisible()).toBe(false);

    window.dispatchEvent(new Event('keyboardDidShow'));
    expect(keyboardCtrl.isKeyboardVisible()).toBe(true);

    window.dispatchEvent(new Event('keyboardWillHide'));
    expect(keyboardCtrl.isKeyboardVisible()).toBe(true);

    window.dispatchEvent(new Event('keyboardDidHide'));
    expect(keyboardCtrl.isKeyboardVisible()).toBe(false);
  });

  it('should run the callback', () => {
    const callbackMock = jest.fn();
    createKeyboardController(callbackMock);

    window.dispatchEvent(new Event('keyboardWillShow'));
    expect(callbackMock).toHaveBeenCalledWith(false, 'willShow');

    window.dispatchEvent(new Event('keyboardDidShow'));
    expect(callbackMock).toHaveBeenCalledWith(true, 'didShow');

    window.dispatchEvent(new Event('keyboardWillHide'));
    expect(callbackMock).toHaveBeenCalledWith(true, 'willHide');

    window.dispatchEvent(new Event('keyboardDidHide'));
    expect(callbackMock).toHaveBeenCalledWith(false, 'didHide');
  });
});
