import { createKeyboardController } from '../keyboard-controller';

describe('Keyboard Controller', () => {
  it('should update isKeyboardVisible', async () => {
    const keyboardCtrl =
      await createKeyboardController();

    window.dispatchEvent(
      new Event('keyboardWillShow')
    );
    expect(
      keyboardCtrl.isKeyboardVisible()
    ).toBe(true);

    window.dispatchEvent(
      new Event('keyboardWillHide')
    );
    expect(
      keyboardCtrl.isKeyboardVisible()
    ).toBe(false);
  });

  it('should run the callback', async () => {
    const callbackMock = jest.fn();
    await createKeyboardController(
      callbackMock
    );

    window.dispatchEvent(
      new Event('keyboardWillShow')
    );
    expect(
      callbackMock
    ).toHaveBeenCalledWith(
      true,
      undefined
    );

    window.dispatchEvent(
      new Event('keyboardWillHide')
    );
    expect(
      callbackMock
    ).toHaveBeenCalledWith(
      false,
      undefined
    );
  });
});
