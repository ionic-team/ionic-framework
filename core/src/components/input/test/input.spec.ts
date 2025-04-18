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
