import { newSpecPage } from '@stencil/core/testing';

import { Searchbar } from '../searchbar';

describe('searchbar: rendering', () => {
  it('should inherit attributes', async () => {
    const page = await newSpecPage({
      components: [Searchbar],
      html: '<ion-searchbar name="search"></ion-searchbar>',
    });

    const nativeEl = page.body.querySelector('ion-searchbar input');
    expect(nativeEl.getAttribute('name')).toBe('search');
  });
});
