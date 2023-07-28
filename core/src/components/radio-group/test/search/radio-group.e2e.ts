import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { RadioFixture } from '../fixtures';

/**
 * This behavior does not var across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio-group: search'), () => {
    test('radio should remain checked after being removed/readded to the dom', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/search', config);

      const radioFixture = new RadioFixture(page);

      const radioGroup = page.locator('ion-radio-group');
      const searchbarInput = page.locator('ion-searchbar input');

      // select radio
      const radio = await radioFixture.checkRadio('mouse', 'ion-radio[value=two]');
      await radioFixture.expectChecked(true);

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
      await radioFixture.expectChecked(true);
    });
  });
});
