import { newSpecPage } from '@stencil/core/testing';

import { MenuButton } from '../menu-button';

describe('menu button: tabindex', () => {
  it('should move tabindex from the host to the native button', async () => {
    const page = await newSpecPage({
      components: [MenuButton],
      html: '<ion-menu-button tabindex="0"></ion-menu-button>',
    });

    const menuButton = page.body.querySelector('ion-menu-button')!;
    const nativeEl = menuButton.shadowRoot!.querySelector('button')!;

    expect(menuButton.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });
});
