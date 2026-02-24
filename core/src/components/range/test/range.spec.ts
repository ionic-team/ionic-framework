import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../item/item';
import { Range } from '../range';

const waitForEvent = (el: HTMLElement, eventName: string) =>
  new Promise<void>((resolve) => el.addEventListener(eventName, () => resolve(), { once: true }));

let sharedRange: Range;

describe('range: values', () => {
  beforeEach(() => {
    sharedRange = new Range();
  });
  describe('ensureValueInBounds()', () => {
    it('should return the clamped value for a range single knob component', () => {
      sharedRange.min = 0;
      sharedRange.max = 100;

      const valueTests = [
        [50, 50],
        [-100, 0],
        [1000, 100],
        [0, 0],
        [100, 100],
      ];

      valueTests.forEach((test) => {
        // Casting as any since we are accessing a private API on the range component
        expect((sharedRange as any).ensureValueInBounds(test[0])).toBe(test[1]);
      });
    });

    it('should handle undefined min and max values by falling back to defaults', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range id="my-custom-range">
        <div slot="label">Range</div>
      </ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      // Here we have to cast this to any, but in its react wrapper it accepts undefined as a valid value
      range.min = undefined as any;
      range.max = undefined as any;
      range.step = undefined as any;
      await page.waitForChanges();
      expect(range.min).toBe(0);
      expect(range.max).toBe(100);
      expect(range.step).toBe(1);
    });

    it('should return the clamped value for a range dual knob component', () => {
      sharedRange.min = 0;
      sharedRange.max = 100;
      sharedRange.dualKnobs = true;

      const valueTests = [
        [
          { lower: 0, upper: 0 },
          { lower: 0, upper: 0 },
        ],
        [
          { lower: -100, upper: 0 },
          { lower: 0, upper: 0 },
        ],
        [
          { lower: 0, upper: 10000 },
          { lower: 0, upper: 100 },
        ],
        [
          { lower: -100, upper: 200 },
          { lower: 0, upper: 100 },
        ],
        [
          { lower: 0, upper: 100 },
          { lower: 0, upper: 100 },
        ],
        [
          { lower: 200, upper: -100 },
          { lower: 100, upper: 0 },
        ],
      ];

      valueTests.forEach((test) => {
        // Casting as any since we are accessing a private API on the range component
        expect((sharedRange as any).ensureValueInBounds(test[0])).toEqual(test[1]);
      });
    });
  });
});

describe('range: id', () => {
  it('should render custom id if passed', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `<ion-range id="my-custom-range">
        <div slot="label">Range</div>
      </ion-range>`,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.getAttribute('id')).toBe('my-custom-range');
  });
});

describe('range: item adjustments', () => {
  it('should add start and end adjustment with no content', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-item>
          <ion-range aria-label="Range"></ion-range>
        </ion-item>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(true);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(true);
  });

  it('should add start adjustment with end label and no adornments', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-item>
          <ion-range label="Range" label-placement="end"></ion-range>
        </ion-item>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(true);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(false);
  });

  it('should add end adjustment with start label and no adornments', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-item>
          <ion-range label="Range" label-placement="start"></ion-range>
        </ion-item>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(false);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(true);
  });

  it('should add end adjustment with fixed label and no adornments', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-item>
          <ion-range label="Range" label-placement="fixed"></ion-range>
        </ion-item>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(false);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(true);
  });

  it('should add start adjustment with floating label', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-item>
          <ion-range label="Range" label-placement="floating"></ion-range>
        </ion-item>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(true);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(true);
  });

  it('should add start adjustment with stacked label', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-item>
          <ion-range label="Range" label-placement="stacked"></ion-range>
        </ion-item>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(true);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(true);
  });

  it('should not add adjustment when not in an item', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-range label="Range" label-placement="stacked"></ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(false);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(false);
  });

  it('should not add start adjustment when with start adornment', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-range label="Range" label-placement="end">
          <div slot="start">Start Content</div>
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(false);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(false);
  });

  it('should not add end adjustment when with end adornment', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-range label="Range" label-placement="start">
          <div slot="end">Start Content</div>
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;
    expect(range.classList.contains('range-item-start-adjustment')).toBe(false);
    expect(range.classList.contains('range-item-end-adjustment')).toBe(false);
  });
});

describe('range: css classes', () => {
  describe('value state classes', () => {
    it('should apply range-value-min class when value is at min', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range min="0" max="100" value="0"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;

      expect(range.classList.contains('range-value-min')).toBe(true);
      expect(range.classList.contains('range-value-max')).toBe(false);
    });

    it('should apply range-value-max class when value is at max', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range min="0" max="100" value="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;

      expect(range.classList.contains('range-value-max')).toBe(true);
      expect(range.classList.contains('range-value-min')).toBe(false);
    });

    it('should not apply range-value-min or range-value-max classes when value is in the middle', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range min="0" max="100" value="50"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;

      expect(range.classList.contains('range-value-min')).toBe(false);
      expect(range.classList.contains('range-value-max')).toBe(false);
    });

    it('should apply range-value-min class when lower knob is at min in dual knobs', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      range.value = { lower: 0, upper: 50 };

      await page.waitForChanges();

      expect(range.classList.contains('range-value-min')).toBe(true);
      expect(range.classList.contains('range-value-max')).toBe(false);
    });

    it('should apply range-value-max class when upper knob is at max in dual knobs', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      range.value = { lower: 50, upper: 100 };

      await page.waitForChanges();

      expect(range.classList.contains('range-value-max')).toBe(true);
      expect(range.classList.contains('range-value-min')).toBe(false);
    });

    it('should apply range-value-min and range-value-max classes for dual knobs when both are at boundaries', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      range.value = { lower: 0, upper: 100 };

      await page.waitForChanges();

      expect(range.classList.contains('range-value-min')).toBe(true);
      expect(range.classList.contains('range-value-max')).toBe(true);
    });

    it('should not apply range-value-min or range-value-max classes for dual knobs when neither is at boundaries', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      range.value = { lower: 25, upper: 75 };

      await page.waitForChanges();

      expect(range.classList.contains('range-value-min')).toBe(false);
      expect(range.classList.contains('range-value-max')).toBe(false);
    });
  });

  describe('boolean property classes', () => {
    it('should not have any boolean classes by default', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      expect(range.classList.contains('range-disabled')).toBe(false);
      expect(range.classList.contains('range-dual-knobs')).toBe(false);
      expect(range.classList.contains('range-has-pin')).toBe(false);
    });

    it('should have range-disabled class when disabled is true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range disabled="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      expect(range.classList.contains('range-disabled')).toBe(true);
    });

    it('should have range-dual-knobs class when dual-knobs is true true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      expect(range.classList.contains('range-dual-knobs')).toBe(true);
    });

    it('should have range-has-pin class when pin is true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      expect(range.classList.contains('range-has-pin')).toBe(true);
    });
  });

  describe('pressed state classes', () => {
    it('should have range-pressed class when knob is pressed', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      const component = page.rootInstance;
      component.pressedKnob = 'A';

      await page.waitForChanges();

      expect(range.classList.contains('range-pressed')).toBe(true);
      expect(range.classList.contains('range-pressed-a')).toBe(false);
      expect(range.classList.contains('range-pressed-lower')).toBe(false);
      expect(range.classList.contains('range-pressed-b')).toBe(false);
      expect(range.classList.contains('range-pressed-upper')).toBe(false);
    });

    it('should have range-pressed-lower class when lower knob is pressed', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      const component = page.rootInstance;
      component.pressedKnob = 'A';
      component.ratioA = 0.5;
      component.ratioB = 0.8;

      await page.waitForChanges();
      expect(range.classList.contains('range-pressed-lower')).toBe(true);
    });

    it('should have range-pressed-upper class when upper knob is pressed', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      const component = page.rootInstance;
      component.pressedKnob = 'B';
      component.ratioA = 0.5;
      component.ratioB = 0.8;

      await page.waitForChanges();
      expect(range.classList.contains('range-pressed-upper')).toBe(true);
    });

    it('should have range-pressed-a class when knob A is pressed', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      const component = page.rootInstance;
      component.pressedKnob = 'A';

      await page.waitForChanges();
      expect(range.classList.contains('range-pressed-a')).toBe(true);
    });

    it('should have range-pressed-b class when knob B is pressed', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" min="0" max="100"></ion-range>`,
      });

      const range = page.body.querySelector('ion-range')!;
      const component = page.rootInstance;
      component.pressedKnob = 'B';

      await page.waitForChanges();
      expect(range.classList.contains('range-pressed-b')).toBe(true);
    });
  });
});

describe('range: shadow parts', () => {
  describe('static shadow parts', () => {
    it('should have default shadow parts', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;

      // bar and bar-active parts always exist
      expect(range).toHaveShadowPart('bar');
      expect(range).toHaveShadowPart('bar-active');

      // label part always exists
      expect(range).toHaveShadowPart('label');

      // knob-handle and knob parts always exist
      expect(range).toHaveShadowPart('knob-handle');
      expect(range).toHaveShadowPart('knob');

      // knob-handle a, b, lower, and upper parts only exist when dualKnobs is true
      expect(range).not.toHaveShadowPart('knob-handle-a');
      expect(range).not.toHaveShadowPart('knob-handle-b');
      expect(range).not.toHaveShadowPart('knob-handle-lower');
      expect(range).not.toHaveShadowPart('knob-handle-upper');

      // knob a, b, lower, and upper parts only exist when dualKnobs is true
      expect(range).not.toHaveShadowPart('knob-a');
      expect(range).not.toHaveShadowPart('knob-b');
      expect(range).not.toHaveShadowPart('knob-lower');
      expect(range).not.toHaveShadowPart('knob-upper');

      // pin only exists when pin is true
      expect(range).not.toHaveShadowPart('pin');

      // pin a, b, lower, and upper only exist when both pin and dualKnobs are true
      expect(range).not.toHaveShadowPart('pin-a');
      expect(range).not.toHaveShadowPart('pin-b');
      expect(range).not.toHaveShadowPart('pin-lower');
      expect(range).not.toHaveShadowPart('pin-upper');

      // ticks only exist when ticks is true
      expect(range).not.toHaveShadowPart('tick');
      expect(range).not.toHaveShadowPart('tick-active');
    });

    it('should have tick shadow parts', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range snaps="true" ticks="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;

      // ticks only exist when both snaps and ticks are true
      expect(range).toHaveShadowPart('tick');
      expect(range).toHaveShadowPart('tick-active');
    });

    it('should have pin shadow part', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;

      // pin only exists when pin is true
      expect(range).toHaveShadowPart('pin');

      // pin a, b, lower, and upper only exist when both pin and dualKnobs are true
      expect(range).not.toHaveShadowPart('pin-a');
      expect(range).not.toHaveShadowPart('pin-b');
      expect(range).not.toHaveShadowPart('pin-lower');
      expect(range).not.toHaveShadowPart('pin-upper');
    });

    it('should have dual knob shadow parts', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;

      // knob-handle a, b, lower, and upper parts only exist when dualKnobs is true
      expect(range).toHaveShadowPart('knob-handle-a');
      expect(range).toHaveShadowPart('knob-handle-b');
      expect(range).toHaveShadowPart('knob-handle-lower');
      expect(range).toHaveShadowPart('knob-handle-upper');

      // knob a, b, lower, and upper parts only exist when dualKnobs is true
      expect(range).toHaveShadowPart('knob-a');
      expect(range).toHaveShadowPart('knob-b');
      expect(range).toHaveShadowPart('knob-lower');
      expect(range).toHaveShadowPart('knob-upper');

      // pin only exists when pin is true
      expect(range).toHaveShadowPart('pin');

      // pin a, b, lower, and upper only exist when both pin and dualKnobs are true
      expect(range).toHaveShadowPart('pin-a');
      expect(range).toHaveShadowPart('pin-b');
      expect(range).toHaveShadowPart('pin-lower');
      expect(range).toHaveShadowPart('pin-upper');
    });
  });

  describe('state shadow parts', () => {
    it('should have pressed shadow part when pressed', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;

      // The pressed part should not exist on the knob by default
      expect(shadowRoot.querySelector('[part~="knob"][part~="pressed"]')).toBeNull();

      // Simulate a pressed knob by setting state on component instance
      const component = page.rootInstance;
      component.pressedKnob = 'A';
      await page.waitForChanges();

      // The pressed part should exist on the knob when pressed
      expect(shadowRoot.querySelector('[part~="knob"][part~="pressed"]')).not.toBeNull();

      // Clear the pressed knob
      component.pressedKnob = undefined;
      await page.waitForChanges();

      // The pressed part should not exist after clearing the pressed knob
      expect(shadowRoot.querySelector('[part~="knob"][part~="pressed"]')).toBeNull();
    });

    it('should have focused shadow part when focused', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;

      // The focused part should not exist on the knob by default
      expect(shadowRoot.querySelector('[part~="knob"][part~="focused"]')).toBeNull();

      // Focus the knob handle
      const knobHandle = shadowRoot.querySelector('.range-knob-handle') as HTMLElement;
      knobHandle.focus();
      await page.waitForChanges();

      // The focused part should exist on the knob when focused
      expect(shadowRoot.querySelector('[part~="knob"][part~="focused"]')).not.toBeNull();

      // Blur the knob handle
      knobHandle.blur();
      await waitForEvent(range, 'ionBlur');
      await page.waitForChanges();

      // The focused part should not exist after blur
      expect(shadowRoot.querySelector('[part~="knob"][part~="focused"]')).toBeNull();
    });

    it('should have activated shadow part when activated', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;
      const component = page.rootInstance;

      // The activated part should not exist on the knob by default
      expect(shadowRoot.querySelector('[part~="knob"][part~="activated"]')).toBeNull();

      // Simulate an activated knob by setting state on component instance
      (component as any).activatedKnob = 'A';
      await page.waitForChanges();

      // The activated part should exist on the knob when activated
      expect(shadowRoot.querySelector('[part~="knob"][part~="activated"]')).not.toBeNull();

      // Clear the activated knob
      (component as any).activatedKnob = undefined;
      await page.waitForChanges();

      // The activated part should not exist after clearing the activated knob
      expect(shadowRoot.querySelector('[part~="knob"][part~="activated"]')).toBeNull();
    });

    it('should have hover shadow part when hovered', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;
      const component = page.rootInstance;

      // The hover part should not exist on the knob by default
      expect(shadowRoot.querySelector('[part~="knob"][part~="hover"]')).toBeNull();

      // Simulate a hovered knob by setting state on component instance
      (component as any).hoveredKnob = 'A';
      await page.waitForChanges();

      // The hover part should exist on the knob when hovered
      expect(shadowRoot.querySelector('[part~="knob"][part~="hover"]')).not.toBeNull();

      // Clear the hovered knob
      (component as any).hoveredKnob = undefined;
      await page.waitForChanges();

      // The hover part should not exist after clearing the hovered knob
      expect(shadowRoot.querySelector('[part~="knob"][part~="hover"]')).toBeNull();
    });

    it('should have pressed shadow part on only one knob when dual-knobs is true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;
      const component = page.rootInstance;

      // The pressed part should not exist on either knob by default
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="pressed"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="pressed"]')).toBeNull();

      // Simulate a pressed knob A by setting state on component instance
      component.pressedKnob = 'A';
      await page.waitForChanges();

      // The pressed part should exist on knob A only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="pressed"]')).not.toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="pressed"]')).toBeNull();

      // Simulate a pressed knob B by setting state on component instance
      component.pressedKnob = 'B';
      await page.waitForChanges();

      // The pressed part should now exist on knob B only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="pressed"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="pressed"]')).not.toBeNull();

      // Clear the pressed knob
      component.pressedKnob = undefined;
      await page.waitForChanges();

      // The pressed part should not exist after clearing the pressed knob
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="pressed"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="pressed"]')).toBeNull();
    });

    it('should have focused shadow part on only one knob when dual-knobs is true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;

      // The focused part should not exist on either knob by default
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="focused"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="focused"]')).toBeNull();

      // Focus knob handle A
      const knobHandleA = shadowRoot.querySelector('.range-knob-handle-a') as HTMLElement;
      knobHandleA.focus();
      await page.waitForChanges();

      // The focused part should exist on knob A only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="focused"]')).not.toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="focused"]')).toBeNull();

      // Focus knob handle B
      const knobHandleB = shadowRoot.querySelector('.range-knob-handle-b') as HTMLElement;
      knobHandleB.focus();
      await page.waitForChanges();

      // The focused part should now exist on knob B only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="focused"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="focused"]')).not.toBeNull();

      // Blur knob handle B
      knobHandleB.blur();
      await waitForEvent(range, 'ionBlur');
      await page.waitForChanges();

      // The focused part should not exist after blurring the knob handle
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="focused"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="focused"]')).toBeNull();
    });

    it('should have activated shadow part on only one knob when dual-knobs is true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;
      const component = page.rootInstance;

      // The activated part should not exist on either knob by default
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="activated"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="activated"]')).toBeNull();

      // Simulate an activated knob A by setting state on component instance
      (component as any).activatedKnob = 'A';
      await page.waitForChanges();

      // The activated part should exist on knob A only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="activated"]')).not.toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="activated"]')).toBeNull();

      // Simulate an activated knob B by setting state on component instance
      (component as any).activatedKnob = 'B';
      await page.waitForChanges();

      // The activated part should now exist on knob B only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="activated"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="activated"]')).not.toBeNull();

      // Clear the activated knob
      (component as any).activatedKnob = undefined;
      await page.waitForChanges();

      // The activated part should not exist after clearing the activated knob
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="activated"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="activated"]')).toBeNull();
    });

    it('should have hover shadow part on only one knob when dual-knobs is true', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range dual-knobs="true" pin="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      const shadowRoot = range.shadowRoot!;
      const component = page.rootInstance;

      // The hover part should not exist on either knob by default
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="hover"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="hover"]')).toBeNull();

      // Simulate a hovered knob A by setting state on component instance
      (component as any).hoveredKnob = 'A';
      await page.waitForChanges();

      // The hover part should exist on knob A only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="hover"]')).not.toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="hover"]')).toBeNull();

      // Simulate a hovered knob B by setting state on component instance
      (component as any).hoveredKnob = 'B';
      await page.waitForChanges();

      // The hover part should now exist on knob B only
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="hover"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="hover"]')).not.toBeNull();

      // Clear the hovered knob
      (component as any).hoveredKnob = undefined;
      await page.waitForChanges();

      // The hover part should not exist after clearing the hovered knob
      expect(shadowRoot.querySelector('[part~="knob-a"][part~="hover"]')).toBeNull();
      expect(shadowRoot.querySelector('[part~="knob-b"][part~="hover"]')).toBeNull();
    });
  });
});
