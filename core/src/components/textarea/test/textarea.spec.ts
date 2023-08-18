import { newSpecPage } from '@stencil/core/testing';
import { Textarea } from '../textarea';

it('should inherit attributes', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: '<ion-textarea title="my title" tabindex="-1" data-form-type="password"></ion-textarea>',
  });

  const nativeEl = page.body.querySelector('ion-textarea textarea');
  expect(nativeEl.getAttribute('title')).toBe('my title');
  expect(nativeEl.getAttribute('tabindex')).toBe('-1');
  expect(nativeEl.getAttribute('data-form-type')).toBe('password');
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

    const textarea = page.body.querySelector('ion-textarea');

    const labelText = textarea.querySelector('.label-text-wrapper');

    expect(labelText.textContent).toBe('Label Prop Text');
  });
  it('should render label slot if only slot provided', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `
        <ion-textarea><div slot="label">Label Prop Slot</div></ion-textarea>
      `,
    });

    const textarea = page.body.querySelector('ion-textarea');

    const labelText = textarea.querySelector('.label-text-wrapper');

    expect(labelText.textContent).toBe('Label Prop Slot');
  });
  it('should render label prop if both prop and slot provided', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `
        <ion-textarea label="Label Prop Text"><div slot="label">Label Prop Slot</div></ion-textarea>
      `,
    });

    const textarea = page.body.querySelector('ion-textarea');

    const labelText = textarea.querySelector('.label-text-wrapper');

    expect(labelText.textContent).toBe('Label Prop Text');
  });
});
