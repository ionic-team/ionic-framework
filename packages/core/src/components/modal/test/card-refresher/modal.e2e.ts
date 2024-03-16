import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('card modal - with refresher'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/card-refresher', config);
    });
    test('it should not swipe to close on the content due to the presence of the refresher', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');
      const content = (await page.$('ion-modal ion-content'))!;

      await dragElementBy(content, page, 0, 300);

      await content.waitForElementState('stable');

      await expect(modal).toBeVisible();
    });
  });
});
