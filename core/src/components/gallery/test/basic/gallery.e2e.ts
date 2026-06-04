import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { DEFAULT_COLUMNS, DEFAULT_GAP } from '../../gallery-constants';

const DEFAULT_COLUMNS_BREAKPOINTS = [
  { name: 'xs', width: 384, expectedColumns: DEFAULT_COLUMNS.xs },
  { name: 'sm', width: 576, expectedColumns: DEFAULT_COLUMNS.sm },
  { name: 'md', width: 768, expectedColumns: DEFAULT_COLUMNS.md },
  { name: 'lg', width: 992, expectedColumns: DEFAULT_COLUMNS.lg },
  { name: 'xl', width: 1200, expectedColumns: DEFAULT_COLUMNS.xl },
  { name: 'xxl', width: 1400, expectedColumns: DEFAULT_COLUMNS.xxl },
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

        /**
         * The gallery overflows the default viewport, causing
         * unrendered areas to appear transparent in the screenshot.
         * Resizing the viewport to fit the content.
         */
        const box = await gallery.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box!.width), height: Math.ceil(box!.height) });

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

      test(`should resolve the default gap value on ${breakpoint.name} screens`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 });

        await page.setContent(
          `
            <ion-gallery>
              <img src="/src/components/gallery/test/assets/01.png" alt="One" />
              <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
              <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
              <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
            </ion-gallery>
          `,
          config
        );

        const gallery = page.locator('ion-gallery');

        await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).rowGap)).toBe(DEFAULT_GAP);
        await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).columnGap)).toBe(DEFAULT_GAP);
      });

      test(`should resolve the gap CSS variable on ${breakpoint.name} screens`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 });

        await page.setContent(
          `
            <ion-gallery style="--app-gap: 24px" gap="var(--app-gap)">
              <img src="/src/components/gallery/test/assets/01.png" alt="One" />
              <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
              <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
              <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
            </ion-gallery>
          `,
          config
        );

        const gallery = page.locator('ion-gallery');

        await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).rowGap)).toBe('24px');
        await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).columnGap)).toBe('24px');
      });

      test(`should resolve a gap breakpoint map of CSS variables on ${breakpoint.name} screens`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 900 });

        await page.setContent(
          `
            <ion-gallery style="--g-xs: 2px; --g-sm: 4px; --g-md: 8px; --g-lg: 16px; --g-xl: 24px; --g-xxl: 32px">
              <img src="/src/components/gallery/test/assets/01.png" alt="One" />
              <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
              <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
              <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
            </ion-gallery>
          `,
          config
        );

        const gallery = page.locator('ion-gallery');

        // Breakpoint maps are objects, so they are set as a property rather
        // than an attribute.
        await gallery.evaluate((el) => {
          (el as HTMLIonGalleryElement).gap = {
            xs: 'var(--g-xs)',
            sm: 'var(--g-sm)',
            md: 'var(--g-md)',
            lg: 'var(--g-lg)',
            xl: 'var(--g-xl)',
            xxl: 'var(--g-xxl)',
          };
        });

        // The resolved gap for each breakpoint, matching the variables set in
        // the style above.
        const expectedGap: Record<string, string> = {
          xs: '2px',
          sm: '4px',
          md: '8px',
          lg: '16px',
          xl: '24px',
          xxl: '32px',
        };

        // Each breakpoint resolves its own gap variable.
        await expect
          .poll(() => gallery.evaluate((el) => getComputedStyle(el).rowGap))
          .toBe(expectedGap[breakpoint.name]);
      });
    });

    test('should resolve the gap CSS variable fallback when the variable is not defined', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 900 });

      // The CSS variable `--app-gap` is never declared, so the browser
      // resolves the var() fallback (8px).
      await page.setContent(
        `
          <ion-gallery gap="var(--app-gap, 8px)">
            <img src="/src/components/gallery/test/assets/01.png" alt="One" />
            <img src="/src/components/gallery/test/assets/02.png" alt="Two" />
            <img src="/src/components/gallery/test/assets/03.png" alt="Three" />
            <img src="/src/components/gallery/test/assets/04.png" alt="Four" />
          </ion-gallery>
        `,
        config
      );

      const gallery = page.locator('ion-gallery');

      await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).rowGap)).toBe('8px');
      await expect.poll(() => gallery.evaluate((el) => getComputedStyle(el).columnGap)).toBe('8px');
    });
  });
});
