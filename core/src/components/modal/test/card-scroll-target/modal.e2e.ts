import { expect } from '@playwright/test';
import { dragElementBy, test } from '@utils/test/playwright';

test.describe('card modal - scroll target', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.mode !== 'ios', 'Card style modal is only available on iOS');

    await page.goto('/src/components/modal/test/card-scroll-target');
  });
  test.describe('card modal: swipe to close', () => {
    test('it should swipe to close when swiped on the header', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#card');
      await ionModalDidPresent.next();

      const header = await page.locator('ion-modal ion-header');
      await dragElementBy(header, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('it should swipe to close when swiped on the content', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#card');
      await ionModalDidPresent.next();

      const content = await page.locator('ion-modal .ion-content-scroll-host');
      await dragElementBy(content, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('it should not swipe to close when swiped on the content but the content is scrolled', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');
      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const content = (await page.$('ion-modal .ion-content-scroll-host'))!;

      await content.evaluate((el: HTMLElement) => (el.scrollTop = 500));

      await dragElementBy(content, page, 0, 500);

      await content.waitForElementState('stable');

      expect(modal).toBeVisible();
    });
    test('content should be scrollable after gesture ends', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');
      await ionModalDidPresent.next();

      const content = await page.locator('ion-modal .ion-content-scroll-host');
      await dragElementBy(content, page, 0, 20);

      expect(content).not.toHaveCSS('overflow', 'hidden');
    });
  });
});
