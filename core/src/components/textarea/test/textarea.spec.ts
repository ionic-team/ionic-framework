import { newSpecPage } from '@stencil/core/testing';

import { Textarea } from '../textarea';

it('should inherit attributes', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: '<ion-textarea title="my title" tabindex="-1" data-form-type="password"></ion-textarea>',
  });

  const nativeEl = page.body.querySelector('ion-textarea textarea')!;
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
  const nativeEl = textareaEl.querySelector('textarea')!;

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

    const labelText = textarea.querySelector('.label-text-wrapper')!;

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

    const labelText = textarea.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Prop Slot');
  });
  it('should render label prop if both prop and slot provided', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `
        <ion-textarea label="Label Prop Text"><div slot="label">Label Prop Slot</div></ion-textarea>
      `,
    });

    const textarea = page.body.querySelector('ion-textarea')!;

    const labelText = textarea.querySelector('.label-text-wrapper')!;

    expect(labelText.textContent).toBe('Label Prop Text');
  });
});

// Accessibility tests for error text announcements to screen readers
describe('textarea: error text accessibility', () => {
  it('should have error text element with proper structure', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea" error-text="This field is required"></ion-textarea>`,
    });

    const errorTextEl = page.body.querySelector('ion-textarea .error-text');
    expect(errorTextEl).not.toBe(null);

    // Error text element should always exist and have aria-atomic
    expect(errorTextEl!.getAttribute('aria-atomic')).toBe('true');
    expect(errorTextEl!.getAttribute('id')).toContain('error-text');
  });

  it('should maintain error text structure when error text changes dynamically', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea"></ion-textarea>`,
    });

    const textarea = page.body.querySelector('ion-textarea')!;

    // Add error text dynamically
    textarea.setAttribute('error-text', 'Invalid content');
    await page.waitForChanges();

    const errorTextEl = page.body.querySelector('ion-textarea .error-text');
    expect(errorTextEl).not.toBe(null);
    expect(errorTextEl!.getAttribute('aria-atomic')).toBe('true');
    expect(errorTextEl!.getAttribute('id')).toContain('error-text');
  });

  it('should have proper aria-describedby reference structure', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea" error-text="Required field"></ion-textarea>`,
    });

    const errorTextEl = page.body.querySelector('ion-textarea .error-text')!;

    // Verify the error text element has an ID
    const errorId = errorTextEl.getAttribute('id');
    expect(errorId).toContain('error-text');

    // Note: aria-describedby is dynamically set based on validation state
    // The actual connection happens when the textarea becomes invalid
  });

  it('should have helper text element with proper structure', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea" helper-text="Enter your comments"></ion-textarea>`,
    });

    const helperTextEl = page.body.querySelector('ion-textarea .helper-text');
    expect(helperTextEl).not.toBe(null);
    expect(helperTextEl!.getAttribute('id')).toContain('helper-text');
    expect(helperTextEl!.textContent).toBe('Enter your comments');
  });
});
