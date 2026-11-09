import { newSpecPage } from '@stencil/core/testing';

import { Breadcrumb } from '../breadcrumb';

describe('breadcrumb: tabindex', () => {
  it('should move tabindex from the host to the native anchor of a breadcrumb with an href', async () => {
    const page = await newSpecPage({
      components: [Breadcrumb],
      html: '<ion-breadcrumb href="#" tabindex="0">Home</ion-breadcrumb>',
    });

    const breadcrumb = page.body.querySelector('ion-breadcrumb')!;
    const nativeEl = breadcrumb.shadowRoot!.querySelector('a')!;

    expect(nativeEl.getAttribute('tabindex')).toBe('0');
    expect(breadcrumb.hasAttribute('tabindex')).toBe(false);
  });

  it('should keep tabindex on the host of a breadcrumb without an href', async () => {
    const page = await newSpecPage({
      components: [Breadcrumb],
      html: '<ion-breadcrumb tabindex="0">Home</ion-breadcrumb>',
    });

    const breadcrumb = page.body.querySelector('ion-breadcrumb')!;
    const nativeEl = breadcrumb.shadowRoot!.querySelector('.breadcrumb-native')!;

    expect(breadcrumb.getAttribute('tabindex')).toBe('0');
    expect(nativeEl.hasAttribute('tabindex')).toBe(false);
  });
});
