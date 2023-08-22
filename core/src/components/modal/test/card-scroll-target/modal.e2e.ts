import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('card modal - scroll target'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/card-scroll-target', config);
    });
    test.describe('card modal: swipe to close', () => {
      test('it should swipe to close when swiped on the content', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
        const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

        await page.click('#card');
        await ionModalDidPresent.next();

        const content = page.locator('ion-modal .ion-content-scroll-host');
        await dragElementBy(content, page, 0, 300);

        await ionModalDidDismiss.next();
      });
      test('it should not swipe to close when swiped on the content but the content is scrolled', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#card');
        await ionModalDidPresent.next();

        const modal = page.locator('ion-modal');
        const content = (await page.$('ion-modal .ion-content-scroll-host'))!;

        await content.evaluate((el: HTMLElement) => (el.scrollTop = 500));

        await dragElementBy(content, page, 0, 300);

        await content.waitForElementState('stable');

        await expect(modal).toBeVisible();
      });
      test('content should be scrollable after gesture ends', async ({ page }) => {
        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

        await page.click('#card');
        await ionModalDidPresent.next();

        const content = page.locator('ion-modal .ion-content-scroll-host');
        await dragElementBy(content, page, 0, 20);

        await expect(content).not.toHaveCSS('overflow', 'hidden');
      });
    });
  });
});
