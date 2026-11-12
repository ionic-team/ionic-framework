import { newSpecPage } from '@stencil/core/testing';

import { TabButton } from '../tab-button';

describe('tab button: tabindex', () => {
  it('should move tabindex from the host to the native anchor', async () => {
    const page = await newSpecPage({
      components: [TabButton],
      html: '<ion-tab-button tab="home" tabindex="0">Home</ion-tab-button>',
    });

    const tabButton = page.body.querySelector('ion-tab-button')!;
    const nativeEl = tabButton.shadowRoot!.querySelector('a')!;

    expect(tabButton.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should keep a disabled tab button out of the tab order', async () => {
    const page = await newSpecPage({
      components: [TabButton],
      html: '<ion-tab-button tab="home" tabindex="0" disabled="true">Home</ion-tab-button>',
    });

    const tabButton = page.body.querySelector('ion-tab-button')!;
    const nativeEl = tabButton.shadowRoot!.querySelector('a')!;

    expect(nativeEl.getAttribute('tabindex')).toBe('-1');
    expect(tabButton.hasAttribute('tabindex')).toBe(false);
  });
});
