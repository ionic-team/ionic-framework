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
                <ion-gallery-item><div>One</div></ion-gallery-item>
                <ion-gallery-item><div>Two</div></ion-gallery-item>
                <ion-gallery-item><div>Three</div></ion-gallery-item>
                <ion-gallery-item><div>Four</div></ion-gallery-item>
                <ion-gallery-item><div>Five</div></ion-gallery-item>
                <ion-gallery-item><div>Six</div></ion-gallery-item>
                <ion-gallery-item><div>Seven</div></ion-gallery-item>
                <ion-gallery-item><div>Eight</div></ion-gallery-item>
                <ion-gallery-item><div>Nine</div></ion-gallery-item>
                <ion-gallery-item><div>Ten</div></ion-gallery-item>
                <ion-gallery-item><div>Eleven</div></ion-gallery-item>
                <ion-gallery-item><div>Twelve</div></ion-gallery-item>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          /**
           * The gallery overflows the default viewport, causing
           * unrendered areas to appear transparent in the screenshot.
           * Resizing the viewport to fit the content.
           */
          const box = await gallery.boundingBox();
          await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

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
                <ion-gallery-item><div style="height: 175px">One</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 30px">Two</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 90px">Three</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 50px">Four</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 110px">Five</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 175px">Six</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 130px">Seven</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 80px">Eight</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 110px">Nine</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 90px">Ten</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 100px">Eleven</div></ion-gallery-item>
                <ion-gallery-item><div style="height: 150px">Twelve</div></ion-gallery-item>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          /**
           * The gallery overflows the default viewport, causing
           * unrendered areas to appear transparent in the screenshot.
           * Resizing the viewport to fit the content.
           */
          const box = await gallery.boundingBox();
          await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

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
                <ion-gallery-item><img src="/src/components/gallery/test/assets/01.png" alt="One"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/02.png" alt="Two"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/03.png" alt="Three"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/04.png" alt="Four"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/05.png" alt="Five"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/06.png" alt="Six"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/07.png" alt="Seven"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/08.png" alt="Eight"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/09.png" alt="Nine"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/10.png" alt="Ten"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/11.png" alt="Eleven"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/12.png" alt="Twelve"/></ion-gallery-item>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          /**
           * The gallery overflows the default viewport, causing
           * unrendered areas to appear transparent in the screenshot.
           * Resizing the viewport to fit the content.
           */
          const box = await gallery.boundingBox();
          await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

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
                <ion-gallery-item><img src="/src/components/gallery/test/assets/01.png" alt="One"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/02.png" alt="Two"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/03.png" alt="Three"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/04.png" alt="Four"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/05.png" alt="Five"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/06.png" alt="Six"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/07.png" alt="Seven"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/08.png" alt="Eight"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/09.png" alt="Nine"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/10.png" alt="Ten"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/11.png" alt="Eleven"/></ion-gallery-item>
                <ion-gallery-item><img src="/src/components/gallery/test/assets/12.png" alt="Twelve"/></ion-gallery-item>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          /**
           * The gallery overflows the default viewport, causing
           * unrendered areas to appear transparent in the screenshot.
           * Resizing the viewport to fit the content.
           */
          const box = await gallery.boundingBox();
          await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

          await expect(gallery).toHaveScreenshot(screenshot(`gallery-${layout}${orderSuffix}-images-variable-height`));
        });

        test(`should properly display nested gallery with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <ion-gallery layout="${layout}"${orderAttribute}>
                <div data-gallery-group>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/01.png" alt="One" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/02.png" alt="Two" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/03.png" alt="Three" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/04.png" alt="Four" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/05.png" alt="Five" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/06.png" alt="Six" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/07.png" alt="Seven" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/08.png" alt="Eight" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/09.png" alt="Nine" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/10.png" alt="Ten" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/11.png" alt="Eleven" /></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/12.png" alt="Twelve" /></ion-gallery-item>
                </div>
              </ion-gallery>
            `,
            config
          );

          const gallery = page.locator('ion-gallery');

          /**
           * The gallery overflows the default viewport, causing
           * unrendered areas to appear transparent in the screenshot.
           * Resizing the viewport to fit the content.
           */
          const box = await gallery.boundingBox();
          await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

          await expect(gallery).toHaveScreenshot(screenshot(`gallery-${layout}${orderSuffix}-nested`));
        });

        if (layout === 'masonry') {
          test(`should properly display dynamically appended divs with ${order} order`, async ({ page }) => {
            await page.setContent(
              `
                <style>
                  ${sharedStyles}
                </style>

                <ion-gallery layout="${layout}"${orderAttribute}>
                  <ion-gallery-item><div style="height: 175px">One</div></ion-gallery-item>
                  <ion-gallery-item><div style="height: 30px">Two</div></ion-gallery-item>
                  <ion-gallery-item><div style="height: 90px">Three</div></ion-gallery-item>
                  <ion-gallery-item><div style="height: 50px">Four</div></ion-gallery-item>
                  <ion-gallery-item><div style="height: 110px">Five</div></ion-gallery-item>
                  <ion-gallery-item><div style="height: 175px">Six</div></ion-gallery-item>
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
                const galleryItemEl = document.createElement('ion-gallery-item');
                const divEl = document.createElement('div');
                divEl.style.height = `${itemHeight}px`;
                divEl.textContent = itemLabel;
                galleryItemEl.append(divEl);
                galleryEl.append(galleryItemEl);
              });
            }, appendedItems);

            /**
             * The gallery overflows the default viewport, causing
             * unrendered areas to appear transparent in the screenshot.
             * Resizing the viewport to fit the content.
             */
            const box = await gallery.boundingBox();
            await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

            await expect(gallery).toHaveScreenshot(
              screenshot(`gallery-${layout}${orderSuffix}-divs-dynamically-appended`)
            );
          });

          test(`should properly display dynamically appended images with ${order} order`, async ({ page }) => {
            await page.setContent(
              `
                <style>
                  ${sharedStyles}
                </style>

                <ion-gallery layout="${layout}"${orderAttribute}>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/01.png" alt="One"/></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/02.png" alt="Two"/></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/03.png" alt="Three"/></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/04.png" alt="Four"/></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/05.png" alt="Five"/></ion-gallery-item>
                  <ion-gallery-item><img src="/src/components/gallery/test/assets/06.png" alt="Six"/></ion-gallery-item>
                </ion-gallery>
              `,
              config
            );

            const gallery = page.locator('ion-gallery');
            const appendedItems = [7, 8, 9, 10, 11, 12].map((n) => ({
              itemLabel: numberToWords(n),
              itemSrc: `/src/components/gallery/test/assets/${n.toString().padStart(2, '0')}.png`,
            }));

            await gallery.evaluate((galleryEl, items) => {
              items.forEach(({ itemLabel, itemSrc }) => {
                const galleryItemEl = document.createElement('ion-gallery-item');
                const imageEl = document.createElement('img');
                imageEl.src = itemSrc;
                imageEl.alt = itemLabel;

                galleryItemEl.append(imageEl);
                galleryEl.append(galleryItemEl);
              });
            }, appendedItems);

            /**
             * Wait for the images to load and be visible before
             * resizing the viewport.
             */
            await page.waitForChanges();

            /**
             * The gallery overflows the default viewport, causing
             * unrendered areas to appear transparent in the screenshot.
             * Resizing the viewport to fit the content.
             */
            const box = await gallery.boundingBox();
            await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

            await expect(gallery).toHaveScreenshot(
              screenshot(`gallery-${layout}${orderSuffix}-images-dynamically-appended`)
            );
          });

          test(`should properly display dynamically appended figure-wrapped images with ${order} order`, async ({
            page,
          }) => {
            await page.setContent(
              `
                <style>
                  ${sharedStyles}

                  /**
                   * Redefine the ::slotted(img) styles from gallery.scss
                   * because the nested img does not receive slotted styles.
                   */
                  ion-gallery figure img {
                    display: block;
                    width: 100%;
                    object-fit: cover;
                    object-position: center;
                  }
                </style>

                <ion-gallery layout="${layout}"${orderAttribute}>
                  <ion-gallery-item>
                    <figure>
                      <img src="/src/components/gallery/test/assets/01.png" alt="One"/>
                    </figure>
                  </ion-gallery-item>
                  <ion-gallery-item>
                    <figure>
                      <img src="/src/components/gallery/test/assets/02.png" alt="Two"/>
                    </figure>
                  </ion-gallery-item>
                  <ion-gallery-item>
                    <figure>
                      <img src="/src/components/gallery/test/assets/03.png" alt="Three"/>
                    </figure>
                  </ion-gallery-item>
                  <ion-gallery-item>
                    <figure>
                      <img src="/src/components/gallery/test/assets/04.png" alt="Four"/>
                    </figure>
                  </ion-gallery-item>
                  <ion-gallery-item>
                    <figure>
                      <img src="/src/components/gallery/test/assets/05.png" alt="Five"/>
                    </figure>
                  </ion-gallery-item>
                  <ion-gallery-item>
                    <figure>
                      <img src="/src/components/gallery/test/assets/06.png" alt="Six"/>
                    </figure>
                  </ion-gallery-item>
                </ion-gallery>
              `,
              config
            );

            const gallery = page.locator('ion-gallery');
            const appendedItems = [7, 8, 9, 10, 11, 12].map((n) => ({
              itemLabel: numberToWords(n),
              itemSrc: `/src/components/gallery/test/assets/${n.toString().padStart(2, '0')}.png`,
            }));

            await gallery.evaluate((galleryEl, items) => {
              items.forEach(({ itemLabel, itemSrc }) => {
                const galleryItemEl = document.createElement('ion-gallery-item');
                const figureEl = document.createElement('figure');
                figureEl.className = 'gallery-image-item';

                const imageEl = document.createElement('img');
                imageEl.src = itemSrc;
                imageEl.alt = itemLabel;

                figureEl.append(imageEl);
                galleryItemEl.append(figureEl);
                galleryEl.append(galleryItemEl);
              });
            }, appendedItems);

            /**
             * The gallery overflows the default viewport, causing
             * unrendered areas to appear transparent in the screenshot.
             * Resizing the viewport to fit the content.
             */
            const box = await gallery.boundingBox();
            await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

            await expect(gallery).toHaveScreenshot(
              screenshot(`gallery-${layout}${orderSuffix}-figures-images-dynamically-appended`)
            );
          });
        }
      });
    });
  });
});
