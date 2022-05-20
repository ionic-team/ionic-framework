//import { expect } from '@playwright/test';
import { test, dragElementBy } from '@utils/test/playwright';

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

    const nav = page.locator('ion-nav') as any;
    const ionNavDidChange = await nav.spyOnEvent('ionNavDidChange');

    await page.click('#go-page-two');

    await ionNavDidChange.next();

    const content = await page.locator('.page-two-content');
    await dragElementBy(content, page, 1000, 0, 0);

    await ionNavDidChange.next();
  });
});
