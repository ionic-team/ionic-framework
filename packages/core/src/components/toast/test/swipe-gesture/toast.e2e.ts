import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes and directions.
 */
configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('toast: swipe gesture with top position'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('src/components/toast/test/swipe-gesture', config);
    });
    test('should swipe up to dismiss', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const presentButton = page.locator('#top');
      await presentButton.click();

      await ionToastDidPresent.next();

      const toastWrapper = page.locator('ion-toast#top-toast .toast-wrapper');
      await dragElementBy(toastWrapper, page, 0, -30);

      await ionToastDidDismiss.next();
    });
    test('should swipe up to dismiss with anchor', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const presentButton = page.locator('#top-anchor');
      await presentButton.click();

      await ionToastDidPresent.next();

      const toastWrapper = page.locator('ion-toast#top-anchor-toast .toast-wrapper');
      await dragElementBy(toastWrapper, page, 0, -30);

      await ionToastDidDismiss.next();
    });
  });
  test.describe(title('toast: swipe gesture with bottom position'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('src/components/toast/test/swipe-gesture', config);
    });
    test('should swipe down to dismiss', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const presentButton = page.locator('#bottom');
      await presentButton.click();

      await ionToastDidPresent.next();

      const toastWrapper = page.locator('ion-toast#bottom-toast .toast-wrapper');
      await dragElementBy(toastWrapper, page, 0, 30);

      await ionToastDidDismiss.next();
    });
    test('should swipe down to dismiss with anchor', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const presentButton = page.locator('#bottom-anchor');
      await presentButton.click();

      await ionToastDidPresent.next();

      const toastWrapper = page.locator('ion-toast#bottom-anchor-toast .toast-wrapper');
      await dragElementBy(toastWrapper, page, 0, 30);

      await ionToastDidDismiss.next();
    });
  });
  test.describe(title('toast: swipe gesture with middle position'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('src/components/toast/test/swipe-gesture', config);
    });
    test('should swipe down to dismiss', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const presentButton = page.locator('#middle');
      await presentButton.click();

      await ionToastDidPresent.next();

      const toastWrapper = page.locator('ion-toast#middle-toast .toast-wrapper');
      await dragElementBy(toastWrapper, page, 0, 100);

      await ionToastDidDismiss.next();
    });
    test('should swipe up to dismiss', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');

      const presentButton = page.locator('#middle');
      await presentButton.click();

      await ionToastDidPresent.next();

      const toastWrapper = page.locator('ion-toast#middle-toast .toast-wrapper');
      await dragElementBy(toastWrapper, page, 0, -100);

      await ionToastDidDismiss.next();
    });
  });
});
