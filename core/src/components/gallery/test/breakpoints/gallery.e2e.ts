import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The test page overrides every screen breakpoint to well below its default
 * (xs 0, sm 200, md 400, lg 600, xl 800, xxl 1000), so each width below
 * resolves to a different breakpoint under the defaults than it does under the
 * override.
 *
 * The gallery fills the viewport, so its own width tracks the window unless a
 * case narrows it explicitly.
 *
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('gallery: breakpoints'), () => {
    const columnsFor = (page: any) =>
      page.locator('#gallery').evaluate((el: HTMLElement) => el.style.getPropertyValue('--internal-gallery-columns'));

    test('should resolve columns against the configured breakpoints', async ({ page }) => {
      // 500px is above the configured md (400) but below the default sm (576),
      // so the defaults would resolve to xs and give 1 column
      await page.setViewportSize({ width: 500, height: 800 });
      await page.goto('/src/components/gallery/test/breakpoints', config);

      expect(await columnsFor(page)).toBe('3');
    });

    test('should resolve against its own width rather than the viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 800 });
      await page.goto('/src/components/gallery/test/breakpoints', config);

      // Filling the viewport, the gallery is xxl and takes the default columns
      expect(await columnsFor(page)).toBe('10');

      // Narrowing only the gallery drops it to xs, without the viewport moving
      await page.locator('#gallery-sizer').evaluate((el: HTMLElement) => (el.style.width = '150px'));

      await expect.poll(() => columnsFor(page)).toBe('1');
    });
  });
});
