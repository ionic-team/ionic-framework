import { newSpecPage } from '@stencil/core/testing';

import { Content } from '../content';

describe('content: fixed slot placement', () => {
  it('should should fixed slot after content', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: '<ion-content></ion-content>',
    });

    const content = page.body.querySelector('ion-content')!;
    const fixedSlot = content.shadowRoot!.querySelector('slot[name="fixed"]')!;
    const scrollEl = content.shadowRoot!.querySelector('[part="scroll"]')!;

    expect(fixedSlot.nextElementSibling).not.toBe(scrollEl);
  });

  it('should should fixed slot before content', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<ion-content fixed-slot-placement="before"></ion-content>`,
    });

    const content = page.body.querySelector('ion-content')!;
    const fixedSlot = content.shadowRoot!.querySelector('slot[name="fixed"]')!;
    const scrollEl = content.shadowRoot!.querySelector('[part="scroll"]')!;

    expect(fixedSlot.nextElementSibling).toBe(scrollEl);
  });
});
