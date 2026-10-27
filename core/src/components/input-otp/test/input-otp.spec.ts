import { newSpecPage } from '@stencil/core/testing';

import { InputOTP } from '../input-otp';

const getInputLabels = (page: { body: HTMLElement }) =>
  Array.from(page.body.querySelectorAll('ion-input-otp input')).map((input) => input.getAttribute('aria-label'));

describe('input-otp: input labels', () => {
  it('should label each input with its position by default', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="4"></ion-input-otp>`,
    });

    expect(getInputLabels(page)).toEqual(['Input 1 of 4', 'Input 2 of 4', 'Input 3 of 4', 'Input 4 of 4']);
  });

  it('should prefix each input label with the host aria-label', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="4" aria-label="PIN"></ion-input-otp>`,
    });

    expect(getInputLabels(page)).toEqual(['PIN, 1 of 4', 'PIN, 2 of 4', 'PIN, 3 of 4', 'PIN, 4 of 4']);
  });

  it('should label each input with the output of inputLabelFormatter', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="4" aria-label="PIN"></ion-input-otp>`,
    });

    const inputOtp = page.body.querySelector('ion-input-otp')!;
    inputOtp.inputLabelFormatter = (index: number, length: number) => `Ziffer ${index + 1} von ${length}`;
    await page.waitForChanges();

    expect(getInputLabels(page)).toEqual(['Ziffer 1 von 4', 'Ziffer 2 von 4', 'Ziffer 3 von 4', 'Ziffer 4 von 4']);
  });

  it('should fall back to the default label when inputLabelFormatter throws', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="2" aria-label="PIN"></ion-input-otp>`,
    });
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const inputOtp = page.body.querySelector('ion-input-otp')!;
    inputOtp.inputLabelFormatter = () => {
      throw new Error('formatter error');
    };
    await page.waitForChanges();

    expect(getInputLabels(page)).toEqual(['PIN, 1 of 2', 'PIN, 2 of 2']);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('input-otp: hint text', () => {
  it('should describe every input with the helper text', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="3" helper-text="Check your email"></ion-input-otp>`,
    });

    const helperText = page.body.querySelector('ion-input-otp .helper-text')!;
    expect(helperText.textContent).toBe('Check your email');

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-describedby')).toBe(helperText.id);
    });
  });
});

describe('input-otp: error text', () => {
  it('should describe every input with the error text and mark it invalid when touched and invalid', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp class="ion-touched ion-invalid" length="3" helper-text="Check your email" error-text="Wrong code"></ion-input-otp>`,
    });

    const errorText = page.body.querySelector('ion-input-otp .error-text')!;
    expect(errorText.textContent).toBe('Wrong code');
    expect(page.body.querySelector('ion-input-otp .helper-text')!.textContent).toBe('');

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-describedby')).toBe(errorText.id);
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });

  it('should not mark the inputs invalid when not touched', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp class="ion-invalid" length="3" helper-text="Check your email" error-text="Wrong code"></ion-input-otp>`,
    });

    const helperText = page.body.querySelector('ion-input-otp .helper-text')!;
    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-describedby')).toBe(helperText.id);
      expect(input.hasAttribute('aria-invalid')).toBe(false);
    });
  });
});

describe('input-otp: description', () => {
  it('should describe the group, not each input, with the slotted description', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="3" helper-text="Check your email">Didn't get a code?</ion-input-otp>`,
    });
    await page.waitForChanges();

    const description = page.body.querySelector('ion-input-otp .input-otp-description')!;
    const helperText = page.body.querySelector('ion-input-otp .helper-text')!;
    expect(description.id).not.toBe('');

    const group = page.body.querySelector('ion-input-otp .input-otp-group')!;
    expect(group.getAttribute('aria-describedby')).toBe(description.id);

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-describedby')).toBe(helperText.id);
    });
  });

  it('should not reference the description when it is empty', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="3"></ion-input-otp>`,
    });

    const group = page.body.querySelector('ion-input-otp .input-otp-group')!;
    expect(group.hasAttribute('aria-describedby')).toBe(false);

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.hasAttribute('aria-describedby')).toBe(false);
    });
  });
});

describe('input-otp: host aria attributes', () => {
  it('should merge the host aria-describedby with the hint text on every input', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="3" helper-text="Check your email" aria-describedby="server-error"></ion-input-otp>`,
    });

    const helperText = page.body.querySelector('ion-input-otp .helper-text')!;
    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-describedby')).toBe(`server-error ${helperText.id}`);
    });
  });

  it('should forward the host aria-invalid to every input', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="3" aria-invalid="true"></ion-input-otp>`,
    });

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });

  it('should forward aria-errormessage and aria-required to every input instead of the group', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="3" aria-errormessage="server-error" aria-required="true"></ion-input-otp>`,
    });

    const group = page.body.querySelector('ion-input-otp .input-otp-group')!;
    expect(group.hasAttribute('aria-errormessage')).toBe(false);
    expect(group.hasAttribute('aria-required')).toBe(false);

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-errormessage')).toBe('server-error');
      expect(input.getAttribute('aria-required')).toBe('true');
    });
  });

  it('should name every input from the host aria-labelledby followed by its position', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="2" aria-labelledby="pin-label"></ion-input-otp>`,
    });

    const group = page.body.querySelector('ion-input-otp .input-otp-group')!;
    expect(group.getAttribute('aria-labelledby')).toBe('pin-label');

    const inputs = Array.from(page.body.querySelectorAll('ion-input-otp input'));
    expect(inputs.map((input) => input.getAttribute('aria-label'))).toEqual(['1 of 2', '2 of 2']);
    inputs.forEach((input) => {
      expect(input.getAttribute('aria-labelledby')).toBe(`pin-label ${input.id}`);
    });
  });

  it('should keep the group label when the host has an aria-label', async () => {
    const page = await newSpecPage({
      components: [InputOTP],
      html: `<ion-input-otp length="2" aria-label="PIN"></ion-input-otp>`,
    });

    const group = page.body.querySelector('ion-input-otp .input-otp-group')!;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('PIN');
  });
});
