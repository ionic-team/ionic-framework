import { newSpecPage } from '@stencil/core/testing';

import { Textarea } from '../textarea';

it('should inherit attributes', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: '<ion-textarea title="my title" tabindex="-1" data-form-type="password"></ion-textarea>',
  });

  const textareaEl = page.body.querySelector('ion-textarea')!;
  const nativeEl = textareaEl.shadowRoot!.querySelector('textarea')!;
  expect(nativeEl.getAttribute('title')).toBe('my title');
  expect(nativeEl.getAttribute('tabindex')).toBe('-1');
  expect(nativeEl.getAttribute('data-form-type')).toBe('password');
});

it('should inherit watched attributes', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: '<ion-textarea dir="ltr"></ion-textarea>',
  });

  const textareaEl = page.body.querySelector('ion-textarea')!;
  const nativeEl = textareaEl.shadowRoot!.querySelector('textarea')!;

  expect(nativeEl.getAttribute('dir')).toBe('ltr');

  textareaEl.setAttribute('dir', 'rtl');

  await page.waitForChanges();

  expect(nativeEl.getAttribute('dir')).toBe('rtl');
});

/**
 * Textarea uses emulated slots, so the internal
 * behavior will not exactly match IonSelect's slots.
 * For example, Textarea does not render an actual `<slot>` element
 * internally, so we do not check for that here. Instead,
 * we check to see which label text is being used.
 * If Textarea is updated to use Shadow DOM (and therefore native slots),
 * then we can update these tests to more closely match the Select tests.
 **/
describe('textarea: label rendering', () => {
  it('should render label prop if only prop provided', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `
        <ion-textarea label="Label Prop Text"></ion-textarea>
      `,
    });

    const textarea = page.body.querySelector('ion-textarea')!;

    const labelText = textarea.shadowRoot!.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Prop Text');
  });
  it('should render label slot if only slot provided', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `
        <ion-textarea><div slot="label">Label Prop Slot</div></ion-textarea>
      `,
    });

    const textarea = page.body.querySelector('ion-textarea')!;

    // When using a slot, the content is in the light DOM, not directly
    // accessible via textContent. Check that the slot element exists and
    // the slotted content is in the light DOM.
    const slotEl = textarea.shadowRoot!.querySelector('slot[name="label"]');
    const propEl = textarea.shadowRoot!.querySelector('.label-text');
    const slottedContent = textarea.querySelector('[slot="label"]');

    expect(slotEl).not.toBe(null);
    expect(propEl).toBe(null);
    expect(slottedContent?.textContent).toBe('Label Prop Slot');
  });
  it('should render label prop if both prop and slot provided', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `
        <ion-textarea label="Label Prop Text"><div slot="label">Label Prop Slot</div></ion-textarea>
      `,
    });

    const textarea = page.body.querySelector('ion-textarea')!;

    const labelText = textarea.shadowRoot!.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Prop Text');
  });
});
