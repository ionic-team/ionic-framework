import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Verifies that the focused state on tab buttons
 * uses a dark-appropriate background in the dark palette,
 * not the light-mode fallback (#e0e0e0)
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('tabs: focused state in dark palette'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/tabs/test/basic?ionic:palette=dark', config);

      const tabButton = page.locator('.e2eTabOneButton');
      await tabButton.evaluate((el: HTMLElement) => {
        // focus-visible.ts only adds ion-focused in keyboard mode; trigger it first
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        // the host has no tabindex; focus the actual <a> inside shadow DOM
        (el.shadowRoot?.querySelector('a') as HTMLElement)?.focus();
      });
      await page.waitForChanges();
    });

    test('should not have visual regressions for focused tab button', async ({ page }) => {
      await expect(page.locator('.e2eTabOneButton')).toHaveClass(/ion-focused/);
      await expect(page.locator('ion-tab-bar')).toHaveScreenshot(screenshot('tab-bar-focused-dark'));
    });

    test('focused tab button should not use light-mode fallback color', async ({ page }) => {
      const bgColor = await page
        .locator('.e2eTabOneButton')
        .evaluate((el: HTMLElement) => window.getComputedStyle(el, '::after').backgroundColor);
      // #e0e0e0 (rgb(224, 224, 224)) is the light-mode fallback from get-color-shade(#fff)
      expect(bgColor).not.toBe('rgb(224, 224, 224)');
    });
  });
});
