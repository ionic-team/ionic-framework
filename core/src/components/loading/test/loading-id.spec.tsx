import { newSpecPage } from '@stencil/core/testing';

import { Loading } from '../loading';
import { h } from '@stencil/core';

describe('loading: id', () => {
  it('loading should be assigned an incrementing id', async () => {
    const page = await newSpecPage({
      components: [Loading],
      html: `<ion-loading is-open="true"></ion-loading>`,
    });
    let loading: HTMLIonLoadingElement;

    loading = page.body.querySelector('ion-loading')!;

    expect(loading).not.toBe(null);
    expect(loading.getAttribute('id')).toBe('ion-overlay-1');

    // Remove the loading from the DOM
    loading.remove();
    await page.waitForChanges();

    // Create a new loading to verify the id is incremented
    loading = document.createElement('ion-loading');
    loading.isOpen = true;
    page.body.appendChild(loading);
    await page.waitForChanges();

    loading = page.body.querySelector('ion-loading')!;

    expect(loading.getAttribute('id')).toBe('ion-overlay-2');

    // Presenting the same loading again should reuse the existing id

    loading.isOpen = false;
    await page.waitForChanges();
    loading.isOpen = true;
    await page.waitForChanges();

    loading = page.body.querySelector('ion-loading')!;

    expect(loading.getAttribute('id')).toBe('ion-overlay-2');
  });

  it('should not overwrite the id set in htmlAttributes', async () => {
    const id = 'custom-id';
    const page = await newSpecPage({
      components: [Loading],
      template: () => <ion-loading htmlAttributes={{ id }} overlayIndex={-1}></ion-loading>,
    });

    const alert = page.body.querySelector('ion-loading')!;
    expect(alert.id).toBe(id);
  });
});
