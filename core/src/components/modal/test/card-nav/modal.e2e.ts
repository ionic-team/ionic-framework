import { expect } from '@playwright/test';
import { dragElementBy, test } from '@utils/test/playwright';

test.describe('card modal - nav', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.mode !== 'ios', 'Card style modal is only available on iOS');
    test.skip(testInfo.project.metadata.rtl === true, 'This test only verifies that the gesture activates inside of a modal.');

    await page.goto('/src/components/modal/test/card-nav?ionic:_testing=false');
  });
  test('it should swipe to go back', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#open-modal');
    await ionModalDidPresent.next();

    await page.click('#go-page-two');

    const nav = await page.locator('ion-nav');

    await nav.evaluate((el: HTMLIonNavElement) => {
      return new Promise((resolve) => {
        el.addEventListener('ionNavDidChange', resolve);
      })
    });

    const content = await page.locator('.page-two-content');
    await dragElementBy(nav, page, 1000, 0, 0);

    await nav.evaluate((el: HTMLIonNavElement) => {
      return new Promise((resolve) => {
        el.addEventListener('ionNavDidChange', resolve);
      })
    });
  });
});
