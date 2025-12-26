import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

/**
 * Safe-area tests verify that modals correctly handle safe-area insets
 * based on whether they're touching the screen edges.
 */

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('modal: safe-area - tablet'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('default modal should not have safe-area padding on tablet', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#default-modal');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-default-tablet`));
    });

    test('fullscreen modal should have safe-area padding on tablet', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-fullscreen-tablet`));
    });

    test('sheet modal at partial breakpoint should have bottom safe-area only', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal-partial');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-sheet-partial-tablet`));
    });

    test('sheet modal at full breakpoint should have bottom safe-area', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal-full');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-sheet-full-tablet`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('modal: safe-area - card modal'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('card modal should not have safe-area padding', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-card-tablet`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('modal: safe-area - tablet (MD mode)'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('default modal should not have safe-area padding on tablet', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#default-modal');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-default-tablet`));
    });

    test('fullscreen modal should have safe-area padding on tablet', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-fullscreen-tablet`));
    });

    test('sheet modal at full breakpoint should have bottom safe-area', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal-full');
      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-safe-area-sheet-full-tablet`));
    });
  });
});
