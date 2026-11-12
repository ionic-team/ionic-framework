import { newSpecPage } from '@stencil/core/testing';

import { ItemOption } from '../item-option';

describe('item option: tabindex', () => {
  it('should move tabindex from the host to the native button', async () => {
    const page = await newSpecPage({
      components: [ItemOption],
      html: '<ion-item-option tabindex="0">Delete</ion-item-option>',
    });

    const itemOption = page.body.querySelector('ion-item-option')!;
    const nativeEl = itemOption.shadowRoot!.querySelector('button')!;

    expect(itemOption.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex from the host to the native anchor of an item option with an href', async () => {
    const page = await newSpecPage({
      components: [ItemOption],
      html: '<ion-item-option href="#" tabindex="0">Delete</ion-item-option>',
    });

    const itemOption = page.body.querySelector('ion-item-option')!;
    const nativeEl = itemOption.shadowRoot!.querySelector('a')!;

    expect(itemOption.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });
});
