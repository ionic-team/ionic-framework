import { newSpecPage } from '@stencil/core/testing';

import { FabButton } from '../fab-button';

describe('fab button: tabindex', () => {
  it('should move tabindex from the host to the native button', async () => {
    const page = await newSpecPage({
      components: [FabButton],
      html: '<ion-fab-button tabindex="0">Add</ion-fab-button>',
    });

    const fabButton = page.body.querySelector('ion-fab-button')!;
    const nativeEl = fabButton.shadowRoot!.querySelector('button')!;

    expect(nativeEl.getAttribute('tabindex')).toBe('0');
    expect(fabButton.hasAttribute('tabindex')).toBe(false);
  });
});
