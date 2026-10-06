import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

/**
 * The test page configures every breakpoint below its default
 * (xs 0, sm 200, md 400, lg 600, xl 800, xxl 1000).
 *
 * Only the first test verifies that the configured breakpoints are honored:
 * 500px resolves to md with the override but xs with the defaults. The second
 * verifies that the gallery resolves against its own width rather than the
 * viewport, which is why it also passes with the defaults, both widths
 * resolving to the same breakpoint; the gallery fills the viewport by default,
 * so its width tracks the window unless a test explicitly narrows it.
 *
 * This behavior is the same across modes and directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('gallery: breakpoints'), () => {
    const columnsFor = (page: E2EPage) =>
      page.locator('#gallery').evaluate((el: HTMLElement) => el.style.getPropertyValue('--internal-gallery-columns'));

    test('should resolve columns against the configured breakpoints', async ({ page }) => {
      // 500px is above the configured md (400), so it resolves to md and the
      // page's md value of 3. With the defaults it would be xs, since sm does
      // not start until 576, and give 1 instead.
      await page.setViewportSize({ width: 500, height: 800 });
      await page.goto('/src/components/gallery/test/breakpoints', config);

      expect(await columnsFor(page)).toBe('3');
    });

    test('should resolve against its own width rather than the viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 800 });
      await page.goto('/src/components/gallery/test/breakpoints', config);

      // Filling the viewport, the gallery is xxl and takes the default columns.
      expect(await columnsFor(page)).toBe('10');

      // Narrowing only the gallery drops it to xs, without the viewport moving.
      await page.locator('#gallery-sizer').evaluate((el: HTMLElement) => (el.style.width = '150px'));

      await expect.poll(() => columnsFor(page)).toBe('1');
    });
  });
});
