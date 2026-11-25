import { newSpecPage } from '@stencil/core/testing';

import { InputOTP } from '../input-otp';

describe('input-otp: backspace', () => {
  it('should clear the previous box when Backspace is pressed in an empty box', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp value="789">Description</ion-input-otp>`,
    });

    const inputOtp = page.body.querySelector('ion-input-otp')!;
    const inputs = inputOtp.querySelectorAll('input');
    // The mock document fires focus events even for an element that already
    // has focus, which makes onFocus recurse, so stub focus() instead.
    inputs.forEach((input) => (input.focus = jest.fn()));
    const ionInput = jest.fn();
    inputOtp.addEventListener('ionInput', (ev) => ionInput((ev as CustomEvent).detail.value));

    // Box 4 is empty. The test environment does not apply the browser's default
    // Backspace action, like the iOS keyboard, so the component has to clear box 3 itself.
    const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true });
    inputs[3].dispatchEvent(event);
    await page.waitForChanges();

    expect(inputs[2].value).toBe('');
    expect(inputOtp.value).toBe('78');
    expect(ionInput).toHaveBeenCalledWith('78');
    expect(event.defaultPrevented).toBe(true);
    expect(inputs[2].focus).toHaveBeenCalled();
  });

  it('should not change the value when Backspace is pressed in the first, empty box', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp>Description</ion-input-otp>`,
    });

    const inputOtp = page.body.querySelector('ion-input-otp')!;
    const inputs = inputOtp.querySelectorAll('input');
    inputs.forEach((input) => (input.focus = jest.fn()));

    inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    await page.waitForChanges();

    expect(inputOtp.value).toBe('');
  });
});
