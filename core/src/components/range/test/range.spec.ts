import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../item/item';
import { Range } from '../range';

let sharedRange: Range;

describe('Range', () => {
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

describe('range id', () => {
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

  // TODO FW-2997 remove this
  it('should not add adjustment with legacy syntax', async () => {
    const page = await newSpecPage({
      components: [Item, Range],
      html: `
        <ion-range legacy="true"></ion-range>
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

  describe('shadow parts', () => {
    it('should have shadow parts', async () => {
      const page = await newSpecPage({
        components: [Range],
        html: `<ion-range pin="true" snaps="true" value="50" label="Label"></ion-range>`,
      });
      const range = page.body.querySelector('ion-range')!;
      expect(range.shadowRoot!.querySelector('[part="label"]')).not.toBe(null);
      expect(range.shadowRoot!.querySelector('[part="pin"]')).not.toBe(null);
      expect(range.shadowRoot!.querySelector('[part="knob"]')).not.toBe(null);
      expect(range.shadowRoot!.querySelector('[part="bar"]')).not.toBe(null);
      expect(range.shadowRoot!.querySelector('[part="bar-active"]')).not.toBe(null);
      expect(range.shadowRoot!.querySelector('[part="tick"]')).not.toBe(null);
      expect(range.shadowRoot!.querySelector('[part="tick-active"]')).not.toBe(null);
    });
  });
});
