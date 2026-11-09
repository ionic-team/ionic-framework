import { newSpecPage } from '@stencil/core/testing';

import { Card } from '../card';

describe('card: tabindex', () => {
  it('should move tabindex from the host to the native anchor of a clickable card', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: '<ion-card href="#" tabindex="0"></ion-card>',
    });

    const card = page.body.querySelector('ion-card')!;
    const nativeEl = card.shadowRoot!.querySelector('a')!;

    expect(nativeEl.getAttribute('tabindex')).toBe('0');
    expect(card.hasAttribute('tabindex')).toBe(false);
  });

  it('should keep tabindex on the host of a card that is not clickable', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: '<ion-card tabindex="0"></ion-card>',
    });

    const card = page.body.querySelector('ion-card')!;

    expect(card.getAttribute('tabindex')).toBe('0');
  });
});
