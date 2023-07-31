import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not var across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio-group'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/radio-group/test/legacy/search', config);
    });

    test.describe('radio-group: state', () => {
      test('radio should remain checked after being removed/readded to the dom', async ({ page }) => {
        const radioGroup = page.locator('ion-radio-group');
        const radio = page.locator('ion-radio[value=two]');
        const searchbarInput = page.locator('ion-searchbar input');

        // select radio
        await radio.click();
        await expect(radio.locator('input')).toHaveJSProperty('checked', true);

        // filter radio so it is not in DOM
        await page.fill('ion-searchbar input', 'zero');
        await searchbarInput.evaluate((el) => el.blur());
        await page.waitForChanges();
        await expect(radio).toBeHidden();

        // ensure radio group has the same value
        await expect(radioGroup).toHaveJSProperty('value', 'two');

        // clear the search so the radio appears
        await page.fill('ion-searchbar input', '');
        await searchbarInput.evaluate((el) => el.blur());
        await page.waitForChanges();

        // ensure that the new radio instance is still checked
        await expect(radio.locator('input')).toHaveJSProperty('checked', true);
      });
    });
  });
});
