import { newSpecPage } from '@stencil/core/testing';

import { Range } from '../../range';

describe('range: label', () => {
  it('should prioritize the label prop over the slot', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range label="Label prop">
          <div slot="label">Label slot</div>
        </ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range');
    const propEl = range?.shadowRoot?.querySelector('.label-text');
    const slotEl = range?.shadowRoot?.querySelector('slot[name="label"]');

    expect(propEl).not.toBeNull();
    expect(slotEl).toBeNull();
  });
  it('should prefer aria label if both attribute and visible text provided', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range aria-label="Aria Label Text" label="Label Prop Text"></ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;

    const nativeSlider = range.shadowRoot!.querySelector('.range-knob-handle');

    expect(nativeSlider.getAttribute('aria-label')).toBe('Aria Label Text');
    expect(nativeSlider.getAttribute('aria-labelledby')).toBe(null);
  });
  it('should prefer visible label if only visible text provided', async () => {
    const page = await newSpecPage({
      components: [Range],
      html: `
        <ion-range label="Label Prop Text"></ion-range>
      `,
    });

    const range = page.body.querySelector('ion-range')!;

    const nativeSlider = range.shadowRoot!.querySelector('.range-knob-handle');

    expect(nativeSlider.getAttribute('aria-label')).toBe(null);
    expect(nativeSlider.getAttribute('aria-labelledby')).toBe('range-label');
  });
});
