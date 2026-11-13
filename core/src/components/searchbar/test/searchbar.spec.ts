import { newSpecPage } from '@stencil/core/testing';

import { Searchbar } from '../searchbar';

describe('searchbar: rendering', () => {
  it('should inherit properties on load', async () => {
    const page = await newSpecPage({
      components: [Searchbar],
      html: '<ion-searchbar autocapitalize="off" maxlength="4" minlength="2" name="search"></ion-searchbar>',
    });

    const nativeEl = page.body.querySelector('ion-searchbar input')!;
    expect(nativeEl.getAttribute('name')).toBe('search');
    expect(nativeEl.getAttribute('maxlength')).toBe('4');
    expect(nativeEl.getAttribute('minlength')).toBe('2');
    expect(nativeEl.getAttribute('autocapitalize')).toBe('off');
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

describe('searchbar: back/forward cache restore', () => {
  it('should sync the value when the browser clears the field on restore', async () => {
    const page = await newSpecPage({
      components: [Searchbar],
      html: '<ion-searchbar value="typed"></ion-searchbar>',
    });

    const searchbarEl = page.body.querySelector('ion-searchbar')!;
    const nativeEl = searchbarEl.querySelector('input')!;
    const ionInputSpy = jest.fn();
    searchbarEl.addEventListener('ionInput', ionInputSpy);

    nativeEl.value = '';
    const ev = new Event('pageshow');
    Object.defineProperty(ev, 'persisted', { value: true });
    page.win.dispatchEvent(ev);
    await new Promise((resolve) => page.win.requestAnimationFrame(resolve));
    await page.waitForChanges();

    expect(searchbarEl.value).toBe('');
    expect(ionInputSpy).toHaveBeenCalledTimes(1);
    expect(ionInputSpy.mock.calls[0][0].detail.value).toBe('');
  });
});
