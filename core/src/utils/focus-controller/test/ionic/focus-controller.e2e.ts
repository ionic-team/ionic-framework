import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2ELocator } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('focus controller: ionic components'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/utils/focus-controller/test/ionic', config);
    });
    test('should focus heading', async ({ page }) => {
      const goToPageOneButton = page.locator('page-root ion-button.page-one');
      const nav = page.locator('ion-nav') as E2ELocator;
      const ionNavDidChange = await (nav as any).spyOnEvent('ionNavDidChange');

      // Focus heading on Page One
      await goToPageOneButton.click();
      await ionNavDidChange.next();

      const pageOneTitle = page.locator('page-one ion-title');
      await expect(pageOneTitle).toBeFocused();
    });

    test('should focus banner', async ({ page }) => {
      const goToPageThreeButton = page.locator('page-root ion-button.page-three');
      const nav = page.locator('ion-nav') as E2ELocator;
      const ionNavDidChange = await (nav as any).spyOnEvent('ionNavDidChange');

      const pageThreeHeader = page.locator('page-three ion-header');
      await goToPageThreeButton.click();
      await ionNavDidChange.next();

      await expect(pageThreeHeader).toBeFocused();
    });

    test('should focus content', async ({ page }) => {
      const goToPageTwoButton = page.locator('page-root ion-button.page-two');
      const nav = page.locator('ion-nav') as E2ELocator;
      const ionNavDidChange = await (nav as any).spyOnEvent('ionNavDidChange');
      const pageTwoContent = page.locator('page-two ion-content');

      await goToPageTwoButton.click();
      await ionNavDidChange.next();

      await expect(pageTwoContent).toBeFocused();
    });

    test('should return focus when going back', async ({ page, browserName }) => {
      test.skip(browserName === 'webkit', 'Desktop Safari does not consider buttons to be focusable');

      const goToPageOneButton = page.locator('page-root ion-button.page-one');
      const nav = page.locator('ion-nav') as E2ELocator;
      const ionNavDidChange = await (nav as any).spyOnEvent('ionNavDidChange');
      const pageOneBackButton = page.locator('page-one ion-back-button');

      await goToPageOneButton.click();
      await ionNavDidChange.next();

      await pageOneBackButton.click();
      await ionNavDidChange.next();

      await expect(goToPageOneButton).toBeFocused();
    });
  });
});
