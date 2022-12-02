import { expect } from '@playwright/test';
import { dragElementBy, test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe('card modal - with refresher', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/card-refresher', config);
    });
    test(
      title('it should not swipe to close on the content due to the presence of the refresher'),
      async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#card');
        await ionModalDidPresent.next();

        const modal = await page.locator('ion-modal');
        const content = (await page.$('ion-modal ion-content'))!;

        await dragElementBy(content, page, 0, 500);

        await content.waitForElementState('stable');

        await expect(modal).toBeVisible();
      }
    );
  });
});
