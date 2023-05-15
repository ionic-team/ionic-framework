import { newSpecPage } from '@stencil/core/testing';

import { Select } from '../select';

describe('ion-select', () => {
  it('should render label prop if only prop provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select');

    const propEl = select.shadowRoot.querySelector('.label-text');
    const slotEl = select.shadowRoot.querySelector('slot[name="label"]');

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

    const select = page.body.querySelector('ion-select');

    const propEl = select.shadowRoot.querySelector('.label-text');
    const slotEl = select.shadowRoot.querySelector('slot[name="label"]');

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

    const select = page.body.querySelector('ion-select');

    const propEl = select.shadowRoot.querySelector('.label-text');
    const slotEl = select.shadowRoot.querySelector('slot[name="label"]');

    expect(propEl).not.toBe(null);
    expect(slotEl).toBe(null);
  });
});
