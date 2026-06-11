import { newSpecPage } from '@stencil/core/testing';
import * as logging from '@utils/logging';

import { Gallery } from '../gallery/gallery';

import { GalleryItem } from './gallery-item';

describe('gallery-item', () => {
  let originalMutationObserver: typeof globalThis.MutationObserver | undefined;
  let originalResizeObserver: typeof globalThis.ResizeObserver | undefined;

  beforeEach(() => {
    // The spec environment does not implement these observers, which the
    // components rely on. Provide no-op stand-ins for the duration of the test.
    originalMutationObserver = globalThis.MutationObserver;
    originalResizeObserver = globalThis.ResizeObserver;
    (globalThis as any).MutationObserver = class {
      observe() {}
      disconnect() {}
    };
    (globalThis as any).ResizeObserver = class {
      observe() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    (globalThis as any).MutationObserver = originalMutationObserver;
    (globalThis as any).ResizeObserver = originalResizeObserver;
    jest.restoreAllMocks();
  });

  it('should warn when not used inside an ion-gallery', async () => {
    const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

    await newSpecPage({
      components: [GalleryItem],
      html: `<ion-gallery-item></ion-gallery-item>`,
    });

    expect(warningSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '[ion-gallery-item] - This component should be used as a child of an "ion-gallery" component.'
      ),
      expect.anything()
    );
  });

  it('should not warn when used inside an ion-gallery', async () => {
    const warningSpy = jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

    await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `<ion-gallery><ion-gallery-item></ion-gallery-item></ion-gallery>`,
    });

    expect(warningSpy).not.toHaveBeenCalled();
  });

  it('should not have the gallery layout classes when not inside a gallery', async () => {
    // Suppress the warning for the missing gallery parent.
    jest.spyOn(logging, 'printIonWarning').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `<ion-gallery-item></ion-gallery-item>`,
    });

    const item = page.body.querySelector('ion-gallery-item')!;

    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(false);
    expect(item.classList.contains('in-gallery-layout-masonry')).toBe(false);
  });

  it('should reflect the parent gallery uniform layout as a class', async () => {
    const page = await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `<ion-gallery><ion-gallery-item></ion-gallery-item></ion-gallery>`,
    });

    const item = page.body.querySelector('ion-gallery-item')!;

    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(true);
    expect(item.classList.contains('in-gallery-layout-masonry')).toBe(false);
  });

  it('should reflect the parent gallery masonry layout as a class', async () => {
    const page = await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `<ion-gallery layout="masonry"><ion-gallery-item></ion-gallery-item></ion-gallery>`,
    });

    const item = page.body.querySelector('ion-gallery-item')!;

    expect(item.classList.contains('in-gallery-layout-masonry')).toBe(true);
    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(false);
  });

  it('should update the layout class when the parent gallery layout changes', async () => {
    const page = await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `<ion-gallery layout="uniform"><ion-gallery-item></ion-gallery-item></ion-gallery>`,
    });

    const gallery = page.body.querySelector('ion-gallery')!;
    const item = page.body.querySelector('ion-gallery-item')!;

    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(true);

    // Update the parent gallery's layout at runtime.
    gallery.layout = 'masonry';
    await page.waitForChanges();

    // Verify that the item reflects the new layout class.
    expect(item.classList.contains('in-gallery-layout-masonry')).toBe(true);
    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(false);
  });

  it('should keep its layout class after being detached and reattached', async () => {
    const page = await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `<ion-gallery layout="uniform"><ion-gallery-item></ion-gallery-item></ion-gallery>`,
    });

    const gallery = page.body.querySelector('ion-gallery')!;
    const item = page.body.querySelector('ion-gallery-item')!;

    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(true);

    // Detach and reattach the item, e.g. when a framework re-renders the DOM.
    item.remove();
    gallery.appendChild(item);
    await page.waitForChanges();

    // Verify that the item still reflects the correct layout class.
    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(true);
  });

  it('should reflect the new gallery layout after being moved between galleries', async () => {
    const page = await newSpecPage({
      components: [Gallery, GalleryItem],
      html: `
        <ion-gallery layout="uniform"><ion-gallery-item></ion-gallery-item></ion-gallery>
        <ion-gallery layout="masonry"></ion-gallery>
      `,
    });

    const item = page.body.querySelector('ion-gallery-item')!;
    const masonryGallery = page.body.querySelectorAll('ion-gallery')[1];

    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(true);

    // Move the item out of the uniform gallery and into the masonry gallery.
    masonryGallery.appendChild(item);
    await page.waitForChanges();

    expect(item.classList.contains('in-gallery-layout-masonry')).toBe(true);
    expect(item.classList.contains('in-gallery-layout-uniform')).toBe(false);
  });
});
