import { newSpecPage } from '@stencil/core/testing';

import { Button } from '../button';

describe('button: tabindex', () => {
  it('should move tabindex from the host to the native button', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: '<ion-button tabindex="0">Sign in</ion-button>',
    });

    const button = page.body.querySelector('ion-button')!;
    const nativeEl = button.shadowRoot!.querySelector('button')!;

    expect(button.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex from the host to the native anchor of a button with an href', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: '<ion-button href="#" tabindex="0">Sign in</ion-button>',
    });

    const button = page.body.querySelector('ion-button')!;
    const nativeEl = button.shadowRoot!.querySelector('a')!;

    expect(button.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should leave a negative tabindex on the host', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: '<ion-button tabindex="-1">Sign in</ion-button>',
    });

    const button = page.body.querySelector('ion-button')!;
    const nativeEl = button.shadowRoot!.querySelector('button')!;

    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(nativeEl.hasAttribute('tabindex')).toBe(false);
  });
});
