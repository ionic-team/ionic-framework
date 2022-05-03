import { test } from '@utils/test/playwright';

test.describe('menu - ensure component works without ion-app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/menu/test/standalone');
  });
  test('it should correctly open a menu', async ({ page }) => {
    const ionDidOpen = await page.spyOnEvent('ionDidOpen');
    const ionDidClose = await page.spyOnEvent('ionDidClose');

    const menu = await page.locator('#start-menu');
    await menu.evaluate((el: HTMLIonMenuElement) => el.open());
    await ionDidOpen.next();

    await menu.evaluate((el: HTMLIonMenuElement) => el.close());
    await ionDidClose.next();
  });
});
