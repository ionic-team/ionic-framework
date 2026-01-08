import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Safe-area tests verify that popovers are correctly positioned
 * to avoid overlapping with safe-area zones (status bars, navigation bars, etc.)
 *
 * This is especially important for Android API 36+ where edge-to-edge mode
 * is enforced and apps can no longer opt out.
 */

// Tests that apply to both iOS and MD modes
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: safe-area positioning'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/popover/test/safe-area', config);
    });

    test('popover pinned to bottom should account for safe-area-bottom in position', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      // Use a smaller viewport to force the popover to be constrained
      await page.setViewportSize({ width: 375, height: 500 });

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      // Click the trigger near the bottom of the screen
      await page.click('#bottom-trigger');
      await ionPopoverDidPresent.next();

      // Target the specific popover that was presented (the one with trigger="bottom-trigger")
      const popover = page.locator('ion-popover[trigger="bottom-trigger"]');
      const popoverContent = popover.locator('.popover-content');

      // Get the computed bottom style - should include safe-area calc
      const bottomStyle = await popoverContent.evaluate((el) => el.style.bottom);

      // The bottom should include the safe-area-bottom CSS variable
      // This ensures the popover is positioned above the unsafe area
      expect(bottomStyle).toContain('var(--ion-safe-area-bottom');
    });
  });
});

// iOS-specific tests
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: safe-area positioning - ios specific'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/popover/test/safe-area', config);
    });

    test('floating popover should not have safe-area adjustments', async ({ page }) => {
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await page.click('#small-popover-trigger');
      await ionPopoverDidPresent.next();

      // Target the specific popover
      const popover = page.locator('ion-popover[trigger="small-popover-trigger"]');
      const popoverContent = popover.locator('.popover-content');

      // Get the computed top and bottom styles
      const topStyle = await popoverContent.evaluate((el) => el.style.top);
      const bottomStyle = await popoverContent.evaluate((el) => el.style.bottom);

      // A floating popover in the middle shouldn't have safe-area adjustments
      // The top should be a simple calc without safe-area
      expect(topStyle).not.toContain('var(--ion-safe-area-top');
      // The bottom should not be set for a floating popover
      expect(bottomStyle).toBe('');
    });
  });
});
