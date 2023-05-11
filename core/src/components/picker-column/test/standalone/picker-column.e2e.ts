import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column: standalone'), () => {
    test('should present picker without ion-app', async ({ page }) => {
      await page.goto('/src/components/picker-column/test/standalone', config);

      const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');

      const picker = page.locator('ion-picker');

      await page.click('#single-column-button');

      await ionPickerDidPresent.next();

      await expect(picker).toBeVisible();
    });
  });
});

/**
 * ion-picker-column does not have mode-specific styling for document direction
 */
configs({ modes: ['ios'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('picker-column: document direction'), () => {
    test('should not have visual regressions', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/21205',
      });

      await page.goto('/src/components/picker-column/test/standalone', config);

      const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');

      await page.click('#multiple-column-button');

      await ionPickerDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`picker-column-document-direction`));
    });
  });
});
