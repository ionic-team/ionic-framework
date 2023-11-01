import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio-group: compare-with'), () => {
    test('should correctly set value when using compareWith string', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/compare-with', config);

      const radioGroupWithString = page.locator('#compareWithString');

      await expect(radioGroupWithString).toHaveJSProperty('value', {
        label: 'Blue',
        value: 'blue',
      });
    });

    test('should correctly set value when using compareWith function', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/compare-with', config);

      const radioGroupWithFn = page.locator('#compareWithFn');

      await expect(radioGroupWithFn).toHaveJSProperty('value', {
        label: 'Blue',
        value: 'blue',
      });
    });

    test('should correctly set value to an object when clicked', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/compare-with', config);

      const radioGroupWithFn = page.locator('#compareWithFn');

      const firstRadio = radioGroupWithFn.locator('ion-radio').first();
      await firstRadio.click();
      await page.waitForChanges();

      await expect(radioGroupWithFn).toHaveJSProperty('value', {
        label: 'Red',
        value: 'red',
      });
    });
  });
});
