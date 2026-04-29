import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { numberToWords, sharedStyles } from '../utils';

const LAYOUT_OPTIONS = ['uniform', 'masonry'];
const ORDER_OPTIONS = ['sequential', 'best-fit'];

/**
 * This behavior does not vary across modes/directions.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ config, screenshot, title }) => {
  LAYOUT_OPTIONS.forEach((layout) => {
    const orders = layout === 'masonry' ? ORDER_OPTIONS : [''];

    orders.forEach((order) => {
      const orderAttribute = layout === 'masonry' ? ` order="${order}"` : '';
      const orderSuffix = layout === 'masonry' ? `-${order}` : '';

      test.describe(title(`gallery: ${layout} layout${layout === 'masonry' ? ` (${order})` : ''}`), () => {
        test(`should properly display same height divs with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <style>
                ${sharedStyles}
              </style>

              <ion-gallery layout="${layout}"${orderAttribute}>
                <div>One</div>
                <div>Two</div>
                <div>Three</div>
                <div>Four</div>
                <div>Five</div>
                <div>Six</div>
                <div>Seven</div>
                <div>Eight</div>
                <div>Nine</div>
                <div>Ten</div>
                <div>Eleven</div>
                <div>Twelve</div>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          await expect(gallery).toHaveScreenshot(screenshot(`gallery-${layout}${orderSuffix}-divs-same-height`));
        });

        test(`should properly display variable height divs with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <style>
                ${sharedStyles}
              </style>

              <ion-gallery layout="${layout}"${orderAttribute}>
                <div style="height: 175px">One</div>
                <div style="height: 30px">Two</div>
                <div style="height: 90px">Three</div>
                <div style="height: 50px">Four</div>
                <div style="height: 110px">Five</div>
                <div style="height: 175px">Six</div>
                <div style="height: 130px">Seven</div>
                <div style="height: 80px">Eight</div>
                <div style="height: 110px">Nine</div>
                <div style="height: 90px">Ten</div>
                <div style="height: 100px">Eleven</div>
                <div style="height: 150px">Twelve</div>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          await expect(gallery).toHaveScreenshot(screenshot(`gallery-${layout}${orderSuffix}-divs-variable-height`));
        });

        test(`should properly display same height images with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <style>
                ${sharedStyles}

                img {
                  height: 164px;
                }
              </style>

              <ion-gallery layout="${layout}"${orderAttribute}>
                <img src="/src/components/gallery/test/assets/01.png" alt="One"/>
                <img src="/src/components/gallery/test/assets/02.png" alt="Two"/>
                <img src="/src/components/gallery/test/assets/03.png" alt="Three"/>
                <img src="/src/components/gallery/test/assets/04.png" alt="Four"/>
                <img src="/src/components/gallery/test/assets/05.png" alt="Five"/>
                <img src="/src/components/gallery/test/assets/06.png" alt="Six"/>
                <img src="/src/components/gallery/test/assets/07.png" alt="Seven"/>
                <img src="/src/components/gallery/test/assets/08.png" alt="Eight"/>
                <img src="/src/components/gallery/test/assets/09.png" alt="Nine"/>
                <img src="/src/components/gallery/test/assets/10.png" alt="Ten"/>
                <img src="/src/components/gallery/test/assets/11.png" alt="Eleven"/>
                <img src="/src/components/gallery/test/assets/12.png" alt="Twelve"/>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          await expect(gallery).toHaveScreenshot(screenshot(`gallery-${layout}${orderSuffix}-images-same-height`));
        });

        test(`should properly display variable height images with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <style>
                ${sharedStyles}
              </style>

              <ion-gallery layout="${layout}"${orderAttribute}>
                <img src="/src/components/gallery/test/assets/01.png" alt="One"/>
                <img src="/src/components/gallery/test/assets/02.png" alt="Two"/>
                <img src="/src/components/gallery/test/assets/03.png" alt="Three"/>
                <img src="/src/components/gallery/test/assets/04.png" alt="Four"/>
                <img src="/src/components/gallery/test/assets/05.png" alt="Five"/>
                <img src="/src/components/gallery/test/assets/06.png" alt="Six"/>
                <img src="/src/components/gallery/test/assets/07.png" alt="Seven"/>
                <img src="/src/components/gallery/test/assets/08.png" alt="Eight"/>
                <img src="/src/components/gallery/test/assets/09.png" alt="Nine"/>
                <img src="/src/components/gallery/test/assets/10.png" alt="Ten"/>
                <img src="/src/components/gallery/test/assets/11.png" alt="Eleven"/>
                <img src="/src/components/gallery/test/assets/12.png" alt="Twelve"/>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          await expect(gallery).toHaveScreenshot(screenshot(`gallery-${layout}${orderSuffix}-images-variable-height`));
        });

        if (layout === 'masonry') {
          test(`should properly display dynamically appended divs with ${order} order`, async ({ page }) => {
            await page.setContent(
              `
                <style>
                  ${sharedStyles}
                </style>

                <ion-gallery layout="${layout}"${orderAttribute}>
                  <div style="height: 175px">One</div>
                  <div style="height: 30px">Two</div>
                  <div style="height: 90px">Three</div>
                  <div style="height: 50px">Four</div>
                  <div style="height: 110px">Five</div>
                  <div style="height: 175px">Six</div>
                </ion-gallery>
              `,
              config
            );

            const gallery = page.locator('ion-gallery');

            const divHeights = [130, 80, 110, 90, 100, 150];
            const appendedItems = divHeights.map((height, i) => ({
              itemLabel: numberToWords(7 + i),
              itemHeight: height,
            }));

            await gallery.evaluate((galleryEl, items) => {
              items.forEach(({ itemLabel, itemHeight }) => {
                const divEl = document.createElement('div');
                divEl.style.height = `${itemHeight}px`;
                divEl.textContent = itemLabel;
                galleryEl.append(divEl);
              });
            }, appendedItems);

            await expect(gallery).toHaveScreenshot(
              screenshot(`gallery-${layout}${orderSuffix}-divs-dynamically-appended`)
            );
          });
        }
      });
    });
  });
});
