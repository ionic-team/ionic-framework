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
    expect(errorTextEl!.getAttribute('id')).toContain('error-text');
    expect(errorTextEl!.textContent).toBe('This field is required');
  });

  it('should set aria-invalid when textarea is invalid', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea" error-text="Required field" class="ion-touched ion-invalid"></ion-textarea>`,
    });

    const nativeTextarea = page.body.querySelector('ion-textarea textarea')!;

    // Should be invalid because of the classes
    expect(nativeTextarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-describedby to error text when invalid', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea" error-text="Required field" class="ion-touched ion-invalid"></ion-textarea>`,
    });

    const nativeTextarea = page.body.querySelector('ion-textarea textarea')!;
    const errorTextEl = page.body.querySelector('ion-textarea .error-text')!;

    // Verify aria-describedby points to error text
    const errorId = errorTextEl.getAttribute('id');
    expect(nativeTextarea.getAttribute('aria-describedby')).toBe(errorId);
  });

  it('should set aria-describedby to helper text when valid', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<ion-textarea label="Textarea" helper-text="Enter comments" error-text="Required field"></ion-textarea>`,
    });

    const nativeTextarea = page.body.querySelector('ion-textarea textarea')!;
    const helperTextEl = page.body.querySelector('ion-textarea .helper-text')!;

    // When not invalid, should point to helper text
    const helperId = helperTextEl.getAttribute('id');
    expect(nativeTextarea.getAttribute('aria-describedby')).toBe(helperId);
    expect(nativeTextarea.getAttribute('aria-invalid')).toBe('false');
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

  it('should maintain error text content when error text changes dynamically', async () => {
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
    expect(errorTextEl!.getAttribute('id')).toContain('error-text');
    expect(errorTextEl!.textContent).toBe('Invalid content');
  });
});
