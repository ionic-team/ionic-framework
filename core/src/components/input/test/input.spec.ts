import { newSpecPage } from '@stencil/core/testing';

import { Input } from '../input';

describe('input: rendering', () => {
  it('should inherit attributes', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: '<ion-input title="my title" tabindex="-1" data-form-type="password"></ion-input>',
    });

    const nativeEl = page.body.querySelector('ion-input input')!;
    expect(nativeEl.getAttribute('title')).toBe('my title');
    expect(nativeEl.getAttribute('tabindex')).toBe('-1');
    expect(nativeEl.getAttribute('data-form-type')).toBe('password');
  });

  it('should render bottom content when helper text is defined', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" helper-text="Helper Text"></ion-input>`,
    });

    const bottomContent = page.body.querySelector('ion-input .input-bottom');
    expect(bottomContent).not.toBe(null);
  });

  it('should render bottom content when helper text is undefined', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input"></ion-input>`,
    });

    const bottomContent = page.body.querySelector('ion-input .input-bottom');
    expect(bottomContent).toBe(null);
  });

  it('should render bottom content when helper text is empty string', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" helper-text=""></ion-input>`,
    });

    const bottomContent = page.body.querySelector('ion-input .input-bottom');
    expect(bottomContent).toBe(null);
  });

  it('should inherit watched attributes', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: '<ion-input label="Input" dir="ltr"></ion-input>',
    });

    const inputEl = page.body.querySelector('ion-input')!;
    const nativeEl = inputEl.querySelector('input')!;

    expect(nativeEl.getAttribute('dir')).toBe('ltr');

    inputEl.setAttribute('dir', 'rtl');

    await page.waitForChanges();

    expect(nativeEl.getAttribute('dir')).toBe('rtl');
  });
});

/**
 * Input uses emulated slots, so the internal
 * behavior will not exactly match Select's slots.
 * For example, Input does not render an actual `<slot>` element
 * internally, so we do not check for that here. Instead,
 * we check to see which label text is being used.
 * If Input is updated to use Shadow DOM (and therefore native slots),
 * then we can update these tests to more closely match the Select tests.
 **/
describe('input: label rendering', () => {
  it('should render label prop if only prop provided', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `
        <ion-input label="Label Prop Text"></ion-input>
      `,
    });

    const input = page.body.querySelector('ion-input')!;

    const labelText = input.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Prop Text');
  });
  it('should render label slot if only slot provided', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `
        <ion-input><div slot="label">Label Slot Text</div></ion-input>
      `,
    });

    const input = page.body.querySelector('ion-input')!;

    const labelText = input.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Slot Text');
  });
  it('should render label prop if both prop and slot provided', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `
        <ion-input label="Label Prop Text"><div slot="label">Label Slot Text</div></ion-input>
      `,
    });

    const input = page.body.querySelector('ion-input')!;

    const labelText = input.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Prop Text');
  });
});

// https://github.com/ionic-team/ionic-framework/issues/26974
describe('input: clear icon', () => {
  it('should render custom icon', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `
        <ion-input clear-input-icon="foo" clear-input="true"></ion-input>
      `,
    });

    const icon = page.body.querySelector<HTMLIonIconElement>('ion-input ion-icon')!;

    expect(icon.getAttribute('icon')).toBe('foo');
  });
});

// Regression tests for screen reader accessibility of error messages
describe('input: error text accessibility', () => {
  it('should have error text element with proper structure', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" error-text="This field is required"></ion-input>`,
    });

    const errorTextEl = page.body.querySelector('ion-input .error-text');
    expect(errorTextEl).not.toBe(null);
    expect(errorTextEl!.getAttribute('id')).toContain('error-text');
    expect(errorTextEl!.textContent).toBe('This field is required');
  });

  it('should set aria-invalid when input is invalid', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" error-text="Required field" class="ion-touched ion-invalid"></ion-input>`,
    });

    const nativeInput = page.body.querySelector('ion-input input')!;

    // Should be invalid because of the classes
    expect(nativeInput.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-describedby to error text when invalid', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" error-text="Required field" class="ion-touched ion-invalid"></ion-input>`,
    });

    const nativeInput = page.body.querySelector('ion-input input')!;
    const errorTextEl = page.body.querySelector('ion-input .error-text')!;

    // Verify aria-describedby points to error text
    const errorId = errorTextEl.getAttribute('id');
    expect(nativeInput.getAttribute('aria-describedby')).toBe(errorId);
  });

  it('should set aria-describedby to helper text when valid', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" helper-text="Enter a value" error-text="Required field"></ion-input>`,
    });

    const nativeInput = page.body.querySelector('ion-input input')!;
    const helperTextEl = page.body.querySelector('ion-input .helper-text')!;

    // When not invalid, should point to helper text
    const helperId = helperTextEl.getAttribute('id');
    expect(nativeInput.getAttribute('aria-describedby')).toBe(helperId);
    expect(nativeInput.getAttribute('aria-invalid')).toBe('false');
  });

  it('should have helper text element with proper structure', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input" helper-text="Enter a valid value"></ion-input>`,
    });

    const helperTextEl = page.body.querySelector('ion-input .helper-text');
    expect(helperTextEl).not.toBe(null);
    expect(helperTextEl!.getAttribute('id')).toContain('helper-text');
    expect(helperTextEl!.textContent).toBe('Enter a valid value');
  });

  it('should maintain error text content when error text changes dynamically', async () => {
    const page = await newSpecPage({
      components: [Input],
      html: `<ion-input label="Input"></ion-input>`,
    });

    const input = page.body.querySelector('ion-input')!;

    // Add error text dynamically
    input.setAttribute('error-text', 'Invalid email format');
    await page.waitForChanges();

    const errorTextEl = page.body.querySelector('ion-input .error-text');
    expect(errorTextEl).not.toBe(null);
    expect(errorTextEl!.getAttribute('id')).toContain('error-text');
    expect(errorTextEl!.textContent).toBe('Invalid email format');
  });
});
