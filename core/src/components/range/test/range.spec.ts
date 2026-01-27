import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../item/item';
import { Range } from '../range';

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

describe('range: value state classes', () => {
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

describe('range: boolean property classes', () => {
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

  it('should have range-dual-knobs class when dual-knobs is true', async () => {
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

describe('range: shadow parts', () => {
  it('should have default shadow parts', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `<ion-range value="50" label="Label"></ion-range>`,
    });
    const range = page.body.querySelector('ion-range')!;

    expect(range).toHaveShadowPart('bar');
    expect(range).toHaveShadowPart('bar-active');

    expect(range).toHaveShadowPart('label');

    // knob and knob-handle parts always exist
    expect(range).toHaveShadowPart('knob');
    expect(range).toHaveShadowPart('knob-handle');

    // knob a and knob b only exist when dualKnobs is true
    expect(range).not.toHaveShadowPart('knob-a');
    expect(range).not.toHaveShadowPart('knob-b');
    expect(range).not.toHaveShadowPart('knob-handle-a');
    expect(range).not.toHaveShadowPart('knob-handle-b');

    // ticks only exist when ticks is true
    expect(range).not.toHaveShadowPart('tick');
    expect(range).not.toHaveShadowPart('tick-active');

    // pin only exists when pin is true
    expect(range).not.toHaveShadowPart('pin');
  });

  it('should have tick shadow parts', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `<ion-range snaps="true" ticks="true" value="50" label="Label"></ion-range>`,
    });
    const range = page.body.querySelector('ion-range')!;

    expect(range).toHaveShadowPart('bar');
    expect(range).toHaveShadowPart('bar-active');

    expect(range).toHaveShadowPart('label');

    // knob and knob-handle parts always exist
    expect(range).toHaveShadowPart('knob');
    expect(range).toHaveShadowPart('knob-handle');

    // knob a and knob b only exist when dualKnobs is true
    expect(range).not.toHaveShadowPart('knob-a');
    expect(range).not.toHaveShadowPart('knob-b');
    expect(range).not.toHaveShadowPart('knob-handle-a');
    expect(range).not.toHaveShadowPart('knob-handle-b');

    // ticks only exist when snaps and ticks are true
    expect(range).toHaveShadowPart('tick');
    expect(range).toHaveShadowPart('tick-active');

    // pin only exists when pin is true
    expect(range).not.toHaveShadowPart('pin');
  });

  it('should have pin shadow part', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `<ion-range pin="true" value="50" label="Label"></ion-range>`,
    });
    const range = page.body.querySelector('ion-range')!;

    expect(range).toHaveShadowPart('bar');
    expect(range).toHaveShadowPart('bar-active');

    expect(range).toHaveShadowPart('label');

    // knob and knob-handle parts always exist
    expect(range).toHaveShadowPart('knob');
    expect(range).toHaveShadowPart('knob-handle');

    // knob a and knob b only exist when dualKnobs is true
    expect(range).not.toHaveShadowPart('knob-a');
    expect(range).not.toHaveShadowPart('knob-b');
    expect(range).not.toHaveShadowPart('knob-handle-a');
    expect(range).not.toHaveShadowPart('knob-handle-b');

    // ticks only exist when snaps and ticks are true
    expect(range).not.toHaveShadowPart('tick');
    expect(range).not.toHaveShadowPart('tick-active');

    // pin only exists when pin is true
    expect(range).toHaveShadowPart('pin');
  });

  it('should have dual knob shadow parts', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `<ion-range dual-knobs="true" value="50" label="Label"></ion-range>`,
    });
    const range = page.body.querySelector('ion-range')!;

    expect(range).toHaveShadowPart('bar');
    expect(range).toHaveShadowPart('bar-active');

    expect(range).toHaveShadowPart('label');

    // knob and knob-handle parts always exist
    expect(range).toHaveShadowPart('knob');
    expect(range).toHaveShadowPart('knob-handle');

    // knob a and knob b only exist when dualKnobs is true
    expect(range).toHaveShadowPart('knob-a');
    expect(range).toHaveShadowPart('knob-b');
    expect(range).toHaveShadowPart('knob-handle-a');
    expect(range).toHaveShadowPart('knob-handle-b');

    // ticks only exist when snaps and ticks are true
    expect(range).not.toHaveShadowPart('tick');
    expect(range).not.toHaveShadowPart('tick-active');

    // pin only exists when pin is true
    expect(range).not.toHaveShadowPart('pin');
  });
});
