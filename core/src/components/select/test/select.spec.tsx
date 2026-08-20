import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { SelectOption } from '../../select-option/select-option';
import { Select } from '../select';

describe('ion-select', () => {
  it('should render hidden input for form validation', async () => {
    const page = await newSpecPage({
      components: [Select],
      template: () => <ion-select value="my value" name="my name" disabled={true}></ion-select>,
    });

    const select = page.body.querySelector('ion-select')!;

    const hiddenInput = select.querySelector<HTMLInputElement>('input[type="hidden"]')!;
    expect(hiddenInput).not.toBe(null);

    expect(hiddenInput.value).toBe('my value');
    expect(hiddenInput.disabled).toBe(true);
    expect(hiddenInput.name).toBe('my name');
  });

  it('should render label prop if only prop provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const propEl = select.shadowRoot!.querySelector('.label-text');
    const slotEl = select.shadowRoot!.querySelector('slot[name="label"]');

    expect(propEl).not.toBe(null);
    expect(slotEl).toBe(null);
  });
  it('should render label slot if only slot provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select><div slot="label">Label Prop Slot</div></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const propEl = select.shadowRoot!.querySelector('.label-text');
    const slotEl = select.shadowRoot!.querySelector('slot[name="label"]');

    expect(propEl).toBe(null);
    expect(slotEl).not.toBe(null);
  });
  it('should render label prop if both prop and slot provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"><div slot="label">Label Prop Slot</div></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const propEl = select.shadowRoot!.querySelector('.label-text');
    const slotEl = select.shadowRoot!.querySelector('slot[name="label"]');

    expect(propEl).not.toBe(null);
    expect(slotEl).toBe(null);
  });
  it('should prefer aria label if both attribute and visible text provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select aria-label="Aria Label Text" label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-label')).toBe('Aria Label Text');
  });
  it('should prefer visible label if only visible text provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-label')).toBe('Label Prop Text');
  });
});

describe('select: slot interactivity', () => {
  test('should not prevent click handlers from firing', async () => {
    // https://github.com/ionic-team/ionic-framework/issues/28818
    const divSpy = jest.fn();
    const buttonSpy = jest.fn();

    const page = await newSpecPage({
      components: [Select],
      template: () => (
        <div onClick={divSpy}>
          <ion-select label="Label Prop Text">
            <button slot="end" onClick={buttonSpy}>
              Button
            </button>
          </ion-select>
        </div>
      ),
    });

    const button = page.body.querySelector('button')!;

    await button.click();

    expect(buttonSpy).toHaveBeenCalled();
    expect(divSpy).toHaveBeenCalled();
  });
});

describe('ion-select: required', () => {
  it('should have a aria-required attribute as true in inner button', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select required="true"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-required')).toBe('true');
  });

  it('should not have a aria-required attribute as false in inner button', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select required="false"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-required')).toBe('false');
  });
});

describe('ion-select: option content property reflection', () => {
  beforeEach(() => {
    // Cloning rich option content into the select text only happens when
    // custom HTML rendering is enabled.
    config.reset({ innerHTMLTemplatesEnabled: true });
  });

  afterEach(() => {
    config.reset({});
  });

  it('should reflect ion-icon DOM properties onto attributes so they survive cloning into the select text', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"><ion-icon></ion-icon>Star</ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    const sourceIcon = select.querySelector('ion-icon')!;

    /**
     * Frameworks such as Vue set `icon` as a DOM property rather than an
     * attribute. `cloneNode` only copies attributes, so without reflection
     * the cloned copy in the select text would lose the icon value.
     */
    (sourceIcon as any).icon = 'logo-ionic';

    // Selecting the option rebuilds the displayed text from the option content.
    select.value = 'star';
    await page.waitForChanges();

    const renderedIcon = select.shadowRoot!.querySelector('.select-text ion-icon');
    expect(renderedIcon).not.toBeNull();
    expect(renderedIcon!.getAttribute('icon')).toBe('logo-ionic');
  });

  it('should preserve an ion-icon attribute that is already set when cloning into the select text', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"><ion-icon icon="logo-ionic"></ion-icon>Star</ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;

    select.value = 'star';
    await page.waitForChanges();

    const renderedIcon = select.shadowRoot!.querySelector('.select-text ion-icon');
    expect(renderedIcon).not.toBeNull();
    expect(renderedIcon!.getAttribute('icon')).toBe('logo-ionic');
  });
});
