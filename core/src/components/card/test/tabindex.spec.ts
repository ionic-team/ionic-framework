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

    expect(card.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should keep tabindex on the host of a card that is not clickable', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: '<ion-card tabindex="0"></ion-card>',
    });

    const card = page.body.querySelector('ion-card')!;

    expect(card.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex from the host to the native button of a card with button', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: '<ion-card button tabindex="0"></ion-card>',
    });

    const card = page.body.querySelector('ion-card')!;
    const nativeEl = card.shadowRoot!.querySelector('button')!;

    expect(card.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex off the host when the card becomes clickable', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: '<ion-card tabindex="0"></ion-card>',
    });

    const card = page.body.querySelector('ion-card')!;
    card.button = true;
    await page.waitForChanges();

    const nativeEl = card.shadowRoot!.querySelector('button')!;

    expect(card.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex back onto the host when the card stops being clickable', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: '<ion-card href="#" tabindex="0"></ion-card>',
    });

    const card = page.body.querySelector('ion-card')!;
    card.href = undefined;
    await page.waitForChanges();

    expect(card.getAttribute('tabindex')).toBe('0');
  });
});
