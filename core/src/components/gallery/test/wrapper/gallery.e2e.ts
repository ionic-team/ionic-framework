import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { sharedStyles } from '../utils';

const LAYOUT_OPTIONS = ['uniform', 'masonry'];
const ITEM_HEIGHTS = [175, 30, 90, 50, 110, 175, 130, 80, 110, 90, 100, 150];

const buildItems = () =>
  ITEM_HEIGHTS.map(
    (height, i) => `<ion-gallery-item><div style="height: ${height}px">${i + 1}</div></ion-gallery-item>`
  ).join('');

/**
 * A wrapper element that contains gallery items (e.g. a layout `<div>`
 * or a framework-generated wrapper) must be transparent to the gallery
 * layout. The gallery collapses the wrapper with `display: contents`
 * so the nested items participate in the grid as if the wrapper were
 * not present.
 *
 * Rather than rely on a screenshot, this asserts that a wrapped gallery lays
 * its items out identically to an unwrapped one.
 *
 * This behavior does not vary across modes/directions.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ config, title }) => {
  LAYOUT_OPTIONS.forEach((layout) => {
    test.describe(title(`gallery: wrapper (${layout})`), () => {
      test('should lay out wrapped items identically to unwrapped items', async ({ page }) => {
        const items = buildItems();

        await page.setContent(
          `
            <style>
              ${sharedStyles}
            </style>

            <ion-gallery id="unwrapped" layout="${layout}">${items}</ion-gallery>

            <ion-gallery id="wrapped" layout="${layout}">
              <div class="some-wrapper">${items}</div>
            </ion-gallery>
          `,
          config
        );

        // The wrapper's box is collapsed so it does not affect the grid.
        await expect
          .poll(() => page.locator('#wrapped .some-wrapper').evaluate((el) => getComputedStyle(el).display))
          .toBe('contents');

        const measure = () =>
          page.evaluate(() => {
            const itemRects = (gallerySelector: string) => {
              const gallery = document.querySelector(gallerySelector)!;
              const galleryRect = gallery.getBoundingClientRect();
              return Array.from(gallery.querySelectorAll('ion-gallery-item')).map((item) => {
                const rect = item.getBoundingClientRect();
                return {
                  left: Math.round(rect.left - galleryRect.left),
                  top: Math.round(rect.top - galleryRect.top),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                };
              });
            };

            return { unwrapped: itemRects('#unwrapped'), wrapped: itemRects('#wrapped') };
          });

        // Wait for both layouts to settle, then confirm they match exactly.
        await expect
          .poll(async () => {
            const { unwrapped, wrapped } = await measure();
            return JSON.stringify(unwrapped) === JSON.stringify(wrapped);
          })
          .toBe(true);

        const { unwrapped, wrapped } = await measure();
        expect(wrapped).toEqual(unwrapped);
      });
    });
  });
});
