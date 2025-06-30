import { newSpecPage } from '@stencil/core/testing';

import { Range } from '../../range';

describe('range: dual knobs focus management', () => {
  it('should properly manage initial focus with dual knobs', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range dual-knobs="true" min="0" max="100" value='{"lower": 25, "upper": 75}' aria-label="Dual range">
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range');
    expect(range).not.toBeNull();

    await page.waitForChanges();

    // Get the knob elements
    const knobA = range!.shadowRoot!.querySelector('.range-knob-a') as HTMLElement;
    const knobB = range!.shadowRoot!.querySelector('.range-knob-b') as HTMLElement;

    expect(knobA).not.toBeNull();
    expect(knobB).not.toBeNull();

    // Initially, neither knob should have the ion-focused class
    expect(knobA.classList.contains('ion-focused')).toBe(false);
    expect(knobB.classList.contains('ion-focused')).toBe(false);
  });

  it('should show focus on the correct knob when focused via keyboard navigation', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range dual-knobs="true" min="0" max="100" value='{"lower": 25, "upper": 75}' aria-label="Dual range">
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range');
    await page.waitForChanges();

    const knobA = range!.shadowRoot!.querySelector('.range-knob-a') as HTMLElement;
    const knobB = range!.shadowRoot!.querySelector('.range-knob-b') as HTMLElement;

    // Focus knob A
    knobA.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    // Only knob A should have the ion-focused class
    expect(knobA.classList.contains('ion-focused')).toBe(true);
    expect(knobB.classList.contains('ion-focused')).toBe(false);

    // Focus knob B
    knobB.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    // Only knob B should have the ion-focused class
    expect(knobA.classList.contains('ion-focused')).toBe(false);
    expect(knobB.classList.contains('ion-focused')).toBe(true);
  });

  it('should remove focus from all knobs when focus leaves the range', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range dual-knobs="true" min="0" max="100" value='{"lower": 25, "upper": 75}' aria-label="Dual range">
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range');
    await page.waitForChanges();

    const knobA = range!.shadowRoot!.querySelector('.range-knob-a') as HTMLElement;
    const knobB = range!.shadowRoot!.querySelector('.range-knob-b') as HTMLElement;

    // Focus knob A
    knobA.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(knobA.classList.contains('ion-focused')).toBe(true);

    // Blur the knob (focus leaves the range)
    knobA.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    // Wait for the timeout in onKnobBlur to complete
    await new Promise((resolve) => setTimeout(resolve, 10));
    await page.waitForChanges();

    // Neither knob should have the ion-focused class
    expect(knobA.classList.contains('ion-focused')).toBe(false);
    expect(knobB.classList.contains('ion-focused')).toBe(false);
  });

  it('should emit ionFocus when any knob receives focus but only once until blur', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range dual-knobs="true" min="0" max="100" value='{"lower": 25, "upper": 75}' aria-label="Dual range">
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    await page.waitForChanges();

    let focusEventFiredCount = 0;
    range.addEventListener('ionFocus', () => {
      focusEventFiredCount++;
    });

    const knobA = range.shadowRoot!.querySelector('.range-knob-a') as HTMLElement;
    const knobB = range.shadowRoot!.querySelector('.range-knob-b') as HTMLElement;

    // Focus knob A
    knobA.dispatchEvent(new Event('focus'));
    knobB.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(focusEventFiredCount).toBe(1);
  });

  it('should emit ionBlur when focus leaves the range completely', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range dual-knobs="true" min="0" max="100" value='{"lower": 25, "upper": 75}' aria-label="Dual range">
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    await page.waitForChanges();

    let blurEventFired = false;
    range.addEventListener('ionBlur', () => {
      blurEventFired = true;
    });

    const knobA = range.shadowRoot!.querySelector('.range-knob-a') as HTMLElement;

    // Focus and then blur knob A
    knobA.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    knobA.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    // Wait for the timeout in onKnobBlur to complete
    await new Promise((resolve) => setTimeout(resolve, 10));
    await page.waitForChanges();

    expect(blurEventFired).toBe(true);
  });

  it('should correctly handle Tab navigation between knobs using KeyboardEvent', async () => {
    // Using KeyboardEvent to simulate Tab key is more realistic than just firing focus events
    // because it tests the actual keyboard navigation behavior users would experience
    const page = await newSpecPage({
      components: [Range],
      html: `
        <button id="before">Before</button>
        <ion-range dual-knobs="true" min="0" max="100" value='{"lower": 25, "upper": 75}' aria-label="Dual range">
        </ion-range>
        <button id="after">After</button>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    const beforeButton = page.body.querySelector('#before') as HTMLElement;
    await page.waitForChanges();

    const knobA = range.shadowRoot!.querySelector('.range-knob-a') as HTMLElement;
    const knobB = range.shadowRoot!.querySelector('.range-knob-b') as HTMLElement;

    // Start with focus on element before the range
    beforeButton.focus();

    // Simulate Tab key press - this would move focus to first knob
    let tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      bubbles: true,
      cancelable: true,
    });

    beforeButton.dispatchEvent(tabEvent);
    knobA.focus(); // Browser would focus next tabindex element
    await page.waitForChanges();

    // First knob should be focused
    expect(knobA.classList.contains('ion-focused')).toBe(true);
    expect(knobB.classList.contains('ion-focused')).toBe(false);

    // Simulate another Tab key press - this would move focus to second knob
    tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      bubbles: true,
      cancelable: true,
    });

    knobA.dispatchEvent(tabEvent);
    knobB.focus(); // Browser would focus next tabindex element
    await page.waitForChanges();

    // Second knob should be focused, first should not
    expect(knobA.classList.contains('ion-focused')).toBe(false);
    expect(knobB.classList.contains('ion-focused')).toBe(true);

    // Simulate Shift+Tab (reverse tab) - should go back to first knob
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });

    knobB.dispatchEvent(shiftTabEvent);
    knobA.focus(); // Browser would focus previous tabindex element
    await page.waitForChanges();

    // First knob should be focused again
    expect(knobA.classList.contains('ion-focused')).toBe(true);
    expect(knobB.classList.contains('ion-focused')).toBe(false);

    // Verify Arrow key navigation still works on focused knob
    const arrowEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      code: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    knobA.dispatchEvent(arrowEvent);
    await page.waitForChanges();

    // The knob that visually appears focused should be the one that responds to keyboard input
    expect(knobA.classList.contains('ion-focused')).toBe(true);
  });
});
