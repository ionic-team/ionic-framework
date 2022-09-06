import { expect } from '@playwright/test';
import { test, dragElementBy } from '@utils/test/playwright';

import { CardModalPage } from '../fixtures';

test.describe('card modal - nav', () => {
  let cardModalPage: CardModalPage;
  test.beforeEach(async ({ page, skip }) => {
    skip.mode('md');
    skip.rtl('This test only verifies that the gesture activates inside of a modal.');
    skip.browser(
      (browserName: string) => browserName !== 'chromium',
      'dragElementBy is flaky outside of Chrome browsers.'
    );

    cardModalPage = new CardModalPage(page);
    await cardModalPage.navigate('/src/components/modal/test/card-nav?ionic:_testing=false');
  });
  test('it should swipe to go back', async ({ page }) => {
    await cardModalPage.openModalByTrigger('#open-modal');

    const nav = page.locator('ion-nav') as any;
    const ionNavDidChange = await nav.spyOnEvent('ionNavDidChange');

    await page.click('#go-page-two');

    await ionNavDidChange.next();

    const pageOne = page.locator('page-one');
    await expect(pageOne).toHaveClass(/ion-page-hidden/);

    const content = page.locator('.page-two-content');

    await dragElementBy(content, page, 1000, 0, 10);

    await ionNavDidChange.next();
  });
  test('should swipe to close', async ({ page }) => {
    await cardModalPage.openModalByTrigger('#open-modal');

    const nav = page.locator('ion-nav') as any;
    const ionNavDidChange = await nav.spyOnEvent('ionNavDidChange');

    await page.click('#go-page-two');

    await ionNavDidChange.next();

    await cardModalPage.swipeToCloseModal('ion-modal ion-content.page-two-content');
  });
});
