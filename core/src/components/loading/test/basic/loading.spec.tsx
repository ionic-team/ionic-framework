import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Loading } from '../../loading';

describe('loading: htmlAttributes inheritance', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [Loading],
      template: () => <ion-loading overlayIndex={1} htmlAttributes={{ 'data-testid': 'basic-loading' }}></ion-loading>,
    });

    const loading = page.body.querySelector('ion-loading')!;

    await expect(loading.getAttribute('data-testid')).toBe('basic-loading');
  });
});
