import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { numberToWords, sharedGalleryStyles, sharedGalleryItemStyles } from '../utils';

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
        test(`should properly display same height items with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <style>
                ${sharedGalleryStyles}
                ${sharedGalleryItemStyles}
              </style>

              <ion-gallery layout="${layout}"${orderAttribute}>
                <ion-gallery-item style="height: 150px">One</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Two</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Three</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Four</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Five</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Six</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Seven</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Eight</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Nine</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Ten</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Eleven</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Twelve</ion-gallery-item>
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

        test(`should properly display variable height items with ${layout} layout${
          layout === 'masonry' ? ` and ${order} order` : ''
        }`, async ({ page }) => {
          await page.setContent(
            `
              <style>
                ${sharedGalleryStyles}
                ${sharedGalleryItemStyles}
              </style>

              <ion-gallery layout="${layout}"${orderAttribute}>
                <ion-gallery-item style="height: 175px">One</ion-gallery-item>
                <ion-gallery-item style="height: 30px">Two</ion-gallery-item>
                <ion-gallery-item style="height: 90px">Three</ion-gallery-item>
                <ion-gallery-item style="height: 50px">Four</ion-gallery-item>
                <ion-gallery-item style="height: 110px">Five</ion-gallery-item>
                <ion-gallery-item style="height: 175px">Six</ion-gallery-item>
                <ion-gallery-item style="height: 130px">Seven</ion-gallery-item>
                <ion-gallery-item style="height: 80px">Eight</ion-gallery-item>
                <ion-gallery-item style="height: 110px">Nine</ion-gallery-item>
                <ion-gallery-item style="height: 90px">Ten</ion-gallery-item>
                <ion-gallery-item style="height: 100px">Eleven</ion-gallery-item>
                <ion-gallery-item style="height: 150px">Twelve</ion-gallery-item>
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
                ${sharedGalleryStyles}

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
                ${sharedGalleryStyles}
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

        if (layout === 'masonry') {
          test(`should properly display dynamically appended items with ${order} order`, async ({ page }) => {
            await page.setContent(
              `
                <style>
                  ${sharedGalleryStyles}
                  ${sharedGalleryItemStyles}
                </style>

                <ion-gallery layout="${layout}"${orderAttribute}>
                  <ion-gallery-item style="height: 175px">One</ion-gallery-item>
                  <ion-gallery-item style="height: 30px">Two</ion-gallery-item>
                  <ion-gallery-item style="height: 90px">Three</ion-gallery-item>
                  <ion-gallery-item style="height: 50px">Four</ion-gallery-item>
                  <ion-gallery-item style="height: 110px">Five</ion-gallery-item>
                  <ion-gallery-item style="height: 175px">Six</ion-gallery-item>
                </ion-gallery>
              `,
              config
            );

            const gallery = page.locator('ion-gallery');

            const itemHeights = [130, 80, 110, 90, 100, 150];
            const appendedItems = itemHeights.map((height, i) => ({
              itemLabel: numberToWords(7 + i),
              itemHeight: height,
            }));

            await gallery.evaluate((galleryEl, items) => {
              items.forEach(({ itemLabel, itemHeight }) => {
                const galleryItemEl = document.createElement('ion-gallery-item');
                galleryItemEl.style.height = `${itemHeight}px`;
                galleryItemEl.textContent = itemLabel;
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
                  ${sharedGalleryStyles}
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
                  ${sharedGalleryStyles}

                  /**
                   * The gallery item's ::slotted(img) styles only reach a
                   * directly slotted img, not one nested inside a <figure>,
                   * so redefine them for the nested image here.
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

  test.describe(title('gallery: masonry gap'), () => {
    test('should resolve the gap CSS variable in the masonry layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 900 });

      // Twelve items so the first item is never the last in its column, whose
      // bottom margin masonry zeroes out to remove trailing space.
      await page.setContent(
        `
          <ion-gallery layout="masonry" style="--app-gap: 24px" gap="var(--app-gap)">
            <ion-gallery-item style="height: 40px">One</ion-gallery-item>
            <ion-gallery-item style="height: 80px">Two</ion-gallery-item>
            <ion-gallery-item style="height: 60px">Three</ion-gallery-item>
            <ion-gallery-item style="height: 100px">Four</ion-gallery-item>
            <ion-gallery-item style="height: 50px">Five</ion-gallery-item>
            <ion-gallery-item style="height: 70px">Six</ion-gallery-item>
            <ion-gallery-item style="height: 90px">Seven</ion-gallery-item>
            <ion-gallery-item style="height: 55px">Eight</ion-gallery-item>
            <ion-gallery-item style="height: 75px">Nine</ion-gallery-item>
            <ion-gallery-item style="height: 65px">Ten</ion-gallery-item>
            <ion-gallery-item style="height: 85px">Eleven</ion-gallery-item>
            <ion-gallery-item style="height: 45px">Twelve</ion-gallery-item>
          </ion-gallery>
        `,
        config
      );

      const gallery = page.locator('ion-gallery');

      // In the masonry layout the gap variable drives the column gap
      // and the spacing below items (margin bottom).
      await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).columnGap)).toBe('24px');
      await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el.children[0]).marginBottom)).toBe('24px');
    });
  });
});
