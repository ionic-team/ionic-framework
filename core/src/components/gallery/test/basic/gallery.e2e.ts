import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const DEFAULT_COLUMNS_BREAKPOINTS = [
  { name: 'xs', width: 384, expectedColumns: 2 },
  { name: 'sm', width: 576, expectedColumns: 3 },
  { name: 'md', width: 768, expectedColumns: 4 },
  { name: 'lg', width: 992, expectedColumns: 6 },
  { name: 'xl', width: 1200, expectedColumns: 8 },
  { name: 'xxl', width: 1400, expectedColumns: 10 },
];

/**
 * This behavior does not vary across modes/directions.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('gallery: basic'), () => {
    DEFAULT_COLUMNS_BREAKPOINTS.forEach((breakpoint) => {
      test(`should display ${breakpoint.expectedColumns} columns of images on ${breakpoint.name} screens`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 });

        await page.setContent(
          `
            <ion-gallery>
              <img src="/src/components/gallery/test/assets/01.png" alt="One" />
              <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
              <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
              <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
              <img src="/src/components/gallery/test/assets/05.png" alt="Five" />
              <img src="/src/components/gallery/test/assets/06.png" alt="Six" />
              <img src="/src/components/gallery/test/assets/07.png" alt="Seven" />
              <img src="/src/components/gallery/test/assets/08.png" alt="Eight" />
              <img src="/src/components/gallery/test/assets/09.png" alt="Nine" />
              <img src="/src/components/gallery/test/assets/10.png" alt="Ten" />
              <img src="/src/components/gallery/test/assets/11.png" alt="Eleven" />
              <img src="/src/components/gallery/test/assets/12.png" alt="Twelve" />
            </ion-gallery>
          `,
          config
        );

        const gallery = page.locator('ion-gallery');

        await expect(gallery).toHaveScreenshot(screenshot(`gallery-basic-${breakpoint.name}-breakpoint`));
      });

      test(`should always display 2 columns on ${breakpoint.name} screens when the columns prop is set to 2`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 });

        await page.setContent(
          `
            <ion-gallery columns="2">
              <img src="/src/components/gallery/test/assets/01.png" alt="One" />
              <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
              <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
              <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
              <img src="/src/components/gallery/test/assets/05.png" alt="Five" />
              <img src="/src/components/gallery/test/assets/06.png" alt="Six" />
              <img src="/src/components/gallery/test/assets/07.png" alt="Seven" />
              <img src="/src/components/gallery/test/assets/08.png" alt="Eight" />
              <img src="/src/components/gallery/test/assets/09.png" alt="Nine" />
              <img src="/src/components/gallery/test/assets/10.png" alt="Ten" />
              <img src="/src/components/gallery/test/assets/11.png" alt="Eleven" />
              <img src="/src/components/gallery/test/assets/12.png" alt="Twelve" />
            </ion-gallery>
          `,
          config
        );

        const gallery = page.locator('ion-gallery');

        await expect
          .poll(() =>
            gallery.evaluate((el) => getComputedStyle(el).getPropertyValue('--internal-gallery-columns').trim())
          )
          .toBe('2');
      });

      test(`should display ${breakpoint.expectedColumns} columns on ${breakpoint.name} screens when the internal CSS variable is set to 2`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 });

        await page.setContent(
          `
            <ion-gallery style="--internal-gallery-columns: 2;">
              <img src="/src/components/gallery/test/assets/01.png" alt="One" />
              <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
              <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
              <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
              <img src="/src/components/gallery/test/assets/05.png" alt="Five" />
              <img src="/src/components/gallery/test/assets/06.png" alt="Six" />
              <img src="/src/components/gallery/test/assets/07.png" alt="Seven" />
              <img src="/src/components/gallery/test/assets/08.png" alt="Eight" />
              <img src="/src/components/gallery/test/assets/09.png" alt="Nine" />
              <img src="/src/components/gallery/test/assets/10.png" alt="Ten" />
              <img src="/src/components/gallery/test/assets/11.png" alt="Eleven" />
              <img src="/src/components/gallery/test/assets/12.png" alt="Twelve" />
            </ion-gallery>
          `,
          config
        );

        const gallery = page.locator('ion-gallery');

        await expect
          .poll(() =>
            gallery.evaluate((el) => getComputedStyle(el).getPropertyValue('--internal-gallery-columns').trim())
          )
          .toBe(`${breakpoint.expectedColumns}`);
      });
    });
  });
});
