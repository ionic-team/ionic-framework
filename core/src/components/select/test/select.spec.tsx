import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

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

    const nativeButton = select.shadowRoot!.querySelector('button');

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

    const nativeButton = select.shadowRoot!.querySelector('button');

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
