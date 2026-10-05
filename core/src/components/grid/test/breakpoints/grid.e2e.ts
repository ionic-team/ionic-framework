import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The test page overrides every screen breakpoint to well below its default
 * (xs 0, sm 200, md 400, lg 600, xl 800, xxl 1000). Each width below resolves
 * to a different breakpoint under the defaults than it does under the
 * override, so passing proves the config is driving the styles.
 *
 * The padding and fixed width values are the ones the page sets through the
 * per-breakpoint CSS variables, not the theme defaults.
 *
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('grid: breakpoints'), () => {
    /**
     * One width per breakpoint. Every width except the `xs` one resolves to a
     * smaller breakpoint under the default thresholds, so each case fails if
     * the config is ignored.
     */
    const cases = [
      // xs is 0 under both, but its fixed width is 100% so it tracks the
      // viewport
      { width: 150, breakpoint: 'xs', padding: '0px', fixedWidth: 150, size: '12', colPadding: '0px' },
      // sm under the override, xs by default
      { width: 350, breakpoint: 'sm', padding: '12px', fixedWidth: 180, size: '6', colPadding: '6px' },
      // md under the override, xs by default (below the 576 default sm)
      { width: 500, breakpoint: 'md', padding: '28px', fixedWidth: 360, size: '4', colPadding: '14px' },
      // lg under the override, sm by default
      { width: 650, breakpoint: 'lg', padding: '48px', fixedWidth: 560, size: '3', colPadding: '24px' },
      // xl under the override, md by default
      { width: 850, breakpoint: 'xl', padding: '72px', fixedWidth: 760, size: '2', colPadding: '36px' },
      // xxl under the override, lg by default
      { width: 1100, breakpoint: 'xxl', padding: '100px', fixedWidth: 960, size: '1', colPadding: '50px' },
    ];

    for (const { width, breakpoint, padding, fixedWidth, size, colPadding } of cases) {
      test(`should resolve the ${breakpoint} breakpoint at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/src/components/grid/test/breakpoints', config);

        await expect(page.locator('#padding-grid')).toHaveAttribute('screen-breakpoint', breakpoint);
      });

      test(`should apply the ${breakpoint} padding at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/src/components/grid/test/breakpoints', config);

        const paddingTop = await page.locator('#padding-grid').evaluate((grid) => getComputedStyle(grid).paddingTop);

        expect(paddingTop).toBe(padding);
      });

      test(`should apply the ${breakpoint} fixed width at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/src/components/grid/test/breakpoints', config);

        const measuredWidth = await page.locator('#fixed-grid').evaluate((grid) => grid.getBoundingClientRect().width);

        // Allow 1px tolerance for sub-pixel rounding in the browser.
        expect(measuredWidth).toBeGreaterThanOrEqual(fixedWidth - 1);
        expect(measuredWidth).toBeLessThanOrEqual(fixedWidth + 1);
      });

      /**
       * `ion-col` selects its padding on the `screen-breakpoint` attribute it
       * reflects, so this covers the attribute reaching CSS rather than just
       * the values resolved in JavaScript.
       */
      test(`should apply the ${breakpoint} column padding at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/src/components/grid/test/breakpoints', config);

        const paddingTop = await page
          .locator('#padding-grid ion-col')
          .first()
          .evaluate((col) => getComputedStyle(col).paddingTop);

        expect(paddingTop).toBe(colPadding);
      });

      test(`should resolve the column size object at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/src/components/grid/test/breakpoints', config);

        const span = await page
          .locator('.responsive-col')
          .first()
          .evaluate((col) => col.style.getPropertyValue('--internal-col-span'));

        expect(span).toBe(size);
      });
    }
  });
});

/**
 * Every case above loads the page at a fixed width. These resize an open page
 * instead, which is what actually happens when a window is dragged: the
 * components re-render from `onBreakpointChange` rather than on load.
 *
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('grid: breakpoints on resize'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 350, height: 800 });
      await page.goto('/src/components/grid/test/breakpoints', config);
    });

    test('should re-resolve the breakpoint without reloading', async ({ page }) => {
      const grid = page.locator('#padding-grid');
      await expect(grid).toHaveAttribute('screen-breakpoint', 'sm');

      await page.setViewportSize({ width: 1100, height: 800 });

      await expect(grid).toHaveAttribute('screen-breakpoint', 'xxl');
    });

    test('should re-resolve column sizes without reloading', async ({ page }) => {
      const col = page.locator('.responsive-col').first();
      const span = () => col.evaluate((el) => el.style.getPropertyValue('--internal-col-span'));

      expect(await span()).toBe('6');

      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(col).toHaveAttribute('screen-breakpoint', 'xxl');

      expect(await span()).toBe('1');
    });

    test('should re-resolve padding without reloading', async ({ page }) => {
      const grid = page.locator('#padding-grid');
      const paddingTop = () => grid.evaluate((el) => getComputedStyle(el).paddingTop);

      expect(await paddingTop()).toBe('12px');

      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(grid).toHaveAttribute('screen-breakpoint', 'xxl');

      expect(await paddingTop()).toBe('100px');
    });

    /**
     * The subscription listens on `matchMedia`, so crossing a threshold has to
     * take effect on the next frame rather than after a resize debounce.
     */
    test('should update without a resize debounce when a threshold is crossed', async ({ page }) => {
      const grid = page.locator('#padding-grid');

      await expect(grid).toHaveAttribute('screen-breakpoint', 'sm');

      await page.setViewportSize({ width: 500, height: 800 });

      await expect(grid).toHaveAttribute('screen-breakpoint', 'md', { timeout: 250 });
    });

    test('should resolve back down when the screen narrows again', async ({ page }) => {
      const grid = page.locator('#padding-grid');

      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(grid).toHaveAttribute('screen-breakpoint', 'xxl');

      await page.setViewportSize({ width: 350, height: 800 });

      await expect(grid).toHaveAttribute('screen-breakpoint', 'sm');
    });
  });
});

/**
 * Each rule is emitted twice: a `@media` copy scoped to
 * `:host(:not([screen-breakpoint]))`, and an attribute copy. The first is the
 * baseline for before a component hydrates and for when JavaScript never
 * runs, so it has to resolve from the *compiled* thresholds rather than the
 * `screenBreakpoints` config.
 *
 * Removing the attribute is how that state is reached here: the harness
 * cannot load a page with JavaScript disabled, because its `goto` waits for a
 * flag that scripts set.
 *
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('grid: breakpoints before hydration'), () => {
    test.beforeEach(async ({ page }) => {
      // 800px resolves to the configured xl, but to the compiled md (768px)
      await page.setViewportSize({ width: 800, height: 800 });
      await page.goto('/src/components/grid/test/breakpoints', config);
    });

    test('should fall back to the compiled media query when no breakpoint is reported', async ({ page }) => {
      const grid = page.locator('#padding-grid');

      await expect(grid).toHaveAttribute('screen-breakpoint', 'xl');
      expect(await grid.evaluate((el) => getComputedStyle(el).paddingTop)).toBe('72px');

      await grid.evaluate((el) => el.removeAttribute('screen-breakpoint'));

      // md, because the baseline uses the compiled 768px and ignores the config
      expect(await grid.evaluate((el) => getComputedStyle(el).paddingTop)).toBe('28px');
    });

    test('should fall back for the fixed width too', async ({ page }) => {
      const grid = page.locator('#fixed-grid');
      const width = () => grid.evaluate((el) => Math.round(el.getBoundingClientRect().width));

      await expect(grid).toHaveAttribute('screen-breakpoint', 'xl');
      expect(await width()).toBe(760);

      await grid.evaluate((el) => el.removeAttribute('screen-breakpoint'));

      expect(await width()).toBe(360);
    });
  });
});
