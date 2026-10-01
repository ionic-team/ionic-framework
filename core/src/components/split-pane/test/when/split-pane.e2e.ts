import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * `when` accepts a raw CSS media query, one of the global screen breakpoint
 * shortcuts, the `never` shortcut, or a boolean.
 *
 * Cases that set the markup inline default to an 800px viewport, which sits
 * between the default `md` (768) and `lg` (992) breakpoints. The configured
 * breakpoint cases load the test page instead, which moves `md` to 400px.
 *
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('split-pane: when'), () => {
    const setUpSplitPane = async (page: E2EPage, when: string | undefined, width = 800) => {
      // Omit the prop entirely when `when` is undefined rather than set
      // it to "", so the prop keeps its default
      const whenAttribute = when !== undefined ? `when="${when}"` : '';

      await page.setViewportSize({ width, height: 600 });
      await page.setContent(
        `
          <ion-app>
            <ion-split-pane content-id="main" ${whenAttribute}>
              <ion-menu content-id="main">
                <ion-content>Menu</ion-content>
              </ion-menu>
              <div class="ion-page" id="main">
                <ion-content>Main</ion-content>
              </div>
            </ion-split-pane>
          </ion-app>
        `,
        config
      );

      return page.locator('ion-split-pane');
    };

    /**
     * The default is the `lg` shortcut rather than the `(min-width: 992px)`
     * query it used to be. Both resolve to the same width by default, so
     * these pin the shortcut itself as well as where it activates.
     */
    test.describe('with no value', () => {
      test('should default to the lg shortcut', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, undefined);

        expect(await splitPane.evaluate((el: any) => el.when)).toBe('lg');
      });

      test('should not be visible below the default lg width', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, undefined, 900);

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });

      test('should be visible at the default lg width', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, undefined, 1000);

        await expect(splitPane).toHaveClass(/split-pane-visible/);
      });
    });

    test.describe('with a raw media query', () => {
      test('should be visible when the query matches', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, '(min-width: 500px)');

        await expect(splitPane).toHaveClass(/split-pane-visible/);
      });

      test('should not be visible when the query does not match', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, '(min-width: 900px)');

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });

      test('should support a query that is not a min-width', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, '(orientation: landscape)');

        await expect(splitPane).toHaveClass(/split-pane-visible/);
      });
    });

    test.describe('with a breakpoint shortcut', () => {
      test('should be visible at or above the breakpoint', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, 'md');

        await expect(splitPane).toHaveClass(/split-pane-visible/);
      });

      test('should not be visible below the breakpoint', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, 'lg');

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });

      test('should support the xxl breakpoint', async ({ page }) => {
        // Below the 1400px xxl breakpoint
        const narrow = await setUpSplitPane(page, 'xxl', 1300);
        await expect(narrow).not.toHaveClass(/split-pane-visible/);

        // At the xxl breakpoint
        const wide = await setUpSplitPane(page, 'xxl', 1440);
        await expect(wide).toHaveClass(/split-pane-visible/);
      });
    });

    test.describe('with the "never" shortcut', () => {
      test('should not be visible on a narrow screen', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, 'never', 400);

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });

      test('should not be visible on a wide screen', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, 'never', 1600);

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });
    });

    test.describe('with an unrecognized value', () => {
      test('should not be visible', async ({ page }) => {
        const splitPane = await setUpSplitPane(page, 'not-a-breakpoint');

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });
    });

    /**
     * A boolean can only be set as a JavaScript property, since an HTML
     * attribute is always a string. Each case starts from a shortcut that
     * puts the split pane in the opposite state at the 800px viewport, so
     * the assertion proves the boolean caused the change rather than the
     * split pane already being in that state.
     */
    test.describe('with a boolean', () => {
      test('should be visible when true', async ({ page }) => {
        // lg (992px) does not match at 800px, so this starts hidden
        const splitPane = await setUpSplitPane(page, 'lg');

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);

        await splitPane.evaluate((el: any) => (el.when = true));
        await page.waitForChanges();

        await expect(splitPane).toHaveClass(/split-pane-visible/);
      });

      test('should not be visible when false', async ({ page }) => {
        // md (768px) matches at 800px, so this starts visible
        const splitPane = await setUpSplitPane(page, 'md');

        await expect(splitPane).toHaveClass(/split-pane-visible/);

        await splitPane.evaluate((el: any) => (el.when = false));
        await page.waitForChanges();

        await expect(splitPane).not.toHaveClass(/split-pane-visible/);
      });
    });

    /**
     * The shortcut expands to the `min-width` query of the matching global
     * screen breakpoint, so moving that breakpoint moves when the split pane
     * appears. The page sets `md` to 400px, well below its default of 768px.
     */
    test.describe('with a configured screen breakpoint', () => {
      test('should not be visible below the configured width', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 600 });
        await page.goto('/src/components/split-pane/test/when', config);

        await expect(page.locator('#split-pane')).not.toHaveClass(/split-pane-visible/);
      });

      test('should be visible at the configured width', async ({ page }) => {
        // 500px is above the configured md (400) but below the default md (768)
        await page.setViewportSize({ width: 500, height: 600 });
        await page.goto('/src/components/split-pane/test/when', config);

        await expect(page.locator('#split-pane')).toHaveClass(/split-pane-visible/);
      });
    });
  });
});
