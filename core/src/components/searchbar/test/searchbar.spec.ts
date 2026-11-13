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
  /**
   * Clears the field the way Safari does after restoring the page, then
   * waits for the frame that checks it.
   */
  const restorePage = async (html: string) => {
    const page = await newSpecPage({ components: [Searchbar], html });

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

    return { searchbarEl, nativeEl, ionInputSpy };
  };

  it('should put the value back in the field when the browser clears it', async () => {
    const { searchbarEl, nativeEl, ionInputSpy } = await restorePage('<ion-searchbar value="typed"></ion-searchbar>');

    expect(nativeEl.value).toBe('typed');
    expect(searchbarEl.value).toBe('typed');
    expect(ionInputSpy).not.toHaveBeenCalled();
  });

  it('should sync the value when the browser clears a password field', async () => {
    const { searchbarEl, nativeEl, ionInputSpy } = await restorePage(
      '<ion-searchbar type="password" value="typed"></ion-searchbar>'
    );

    expect(nativeEl.value).toBe('');
    expect(searchbarEl.value).toBe('');
    expect(ionInputSpy).toHaveBeenCalledTimes(1);
    expect(ionInputSpy.mock.calls[0][0].detail.value).toBe('');
  });
});
