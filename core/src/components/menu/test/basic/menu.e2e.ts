import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('menu - basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/menu/test/basic');
  });

  test.describe('menu - visual', () => {
    test('it should open the start menu', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      const menu = await page.locator('#start-menu');
      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await ionDidOpen.next();

      expect(await page.screenshot()).toMatchSnapshot(`menu-start-open-${page.getSnapshotSettings()}.png`);

      await menu.evaluate((el: HTMLIonMenuElement) => el.close());
      await ionDidClose.next();
    });
    test('it should open the end menu', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      const menu = await page.locator('#end-menu');
      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await ionDidOpen.next();

      expect(await page.screenshot()).toMatchSnapshot(`menu-end-open-${page.getSnapshotSettings()}.png`);

      await menu.evaluate((el: HTMLIonMenuElement) => el.close());
      await ionDidClose.next();
    });
    test('it should open the custom menu', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      const menu = await page.locator('#custom-menu');
      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await ionDidOpen.next();

      expect(await page.screenshot()).toMatchSnapshot(`menu-custom-open-${page.getSnapshotSettings()}.png`);

      await menu.evaluate((el: HTMLIonMenuElement) => el.close());
      await ionDidClose.next();
    });
  });

  test.describe('menu - scroll', () => {
    test('it should preserve scroll position', async ({ page, browserName }) => {
      test.skip(browserName === 'firefox', 'Firefox resets the scroll position when hiding the menu');

      await page.setViewportSize({ width: 320, height: 500 });

      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.click('#open-first');
      const menu = await page.locator('#start-menu');
      await ionDidOpen.next();

      const content = await page.locator('#start-menu ion-content');
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToPoint(0, 200));

      await menu.evaluate((el: HTMLIonMenuElement) => el.close());
      await ionDidClose.next();

      await page.click('#open-first');
      await ionDidOpen.next();

      const scrollTop = await content.evaluate(async (el: HTMLIonContentElement) => {
        const contentScrollEl = await el.getScrollElement();
        return contentScrollEl.scrollTop;
      });

      expect(scrollTop).toEqual(200);
    });
  });
});
