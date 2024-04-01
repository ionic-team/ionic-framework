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

    const range =
      page.body.querySelector(
        'ion-range'
      );
    const propEl =
      range?.shadowRoot?.querySelector(
        '.label-text'
      );
    const slotEl =
      range?.shadowRoot?.querySelector(
        'slot[name="label"]'
      );

    expect(propEl).not.toBeNull();
    expect(slotEl).toBeNull();
  });
});
