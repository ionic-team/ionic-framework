import { newSpecPage } from '@stencil/core/testing';

import { Searchbar } from '../searchbar';

describe('searchbar: rendering', () => {
  it('should inherit attributes on load', async () => {
    const page = await newSpecPage({
      components: [Searchbar],
      html: '<ion-searchbar name="search"></ion-searchbar>',
    });

    const nativeEl = page.body.querySelector('ion-searchbar input')!;
    expect(nativeEl.getAttribute('name')).toBe('search');
  });

  it('should inherit watched attributes', async () => {
    const page = await newSpecPage({
      components: [Searchbar],
      html: '<ion-searchbar dir="ltr" lang="en-US"></ion-searchbar>',
    });

    const searchbarEl = page.body.querySelector('ion-searchbar')!;
    const nativeEl = searchbarEl.querySelector('input')!;

    expect(nativeEl.getAttribute('lang')).toBe('en-US');
    expect(nativeEl.getAttribute('dir')).toBe('ltr');

    searchbarEl.setAttribute('lang', 'es-ES');
    searchbarEl.setAttribute('dir', 'rtl');

    await page.waitForChanges();

    expect(nativeEl.getAttribute('lang')).toBe('es-ES');
    expect(nativeEl.getAttribute('dir')).toBe('rtl');
  });
});
