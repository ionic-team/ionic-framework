import { newSpecPage } from '@stencil/core/testing';

import { Breadcrumb } from '../breadcrumb';

describe('breadcrumb: rel', () => {
  it('should set the rel attribute on the link', async () => {
    const page = await newSpecPage({
      components: [Breadcrumb],
      html: `<ion-breadcrumb href="https://ionic.io" rel="noopener noreferrer">Ionic</ion-breadcrumb>`,
    });

    const link = page.body.querySelector('ion-breadcrumb')!.shadowRoot!.querySelector('a')!;

    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
