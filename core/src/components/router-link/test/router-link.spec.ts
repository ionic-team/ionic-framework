import { newSpecPage } from '@stencil/core/testing';

import { RouterLink } from '../router-link';

describe('router link: tabindex', () => {
  it('should move tabindex from the host to the native anchor', async () => {
    const page = await newSpecPage({
      components: [RouterLink],
      html: '<ion-router-link href="/settings" tabindex="0">Settings</ion-router-link>',
    });

    const routerLink = page.body.querySelector('ion-router-link')!;
    const nativeEl = routerLink.shadowRoot!.querySelector('a')!;

    expect(routerLink.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });
});
