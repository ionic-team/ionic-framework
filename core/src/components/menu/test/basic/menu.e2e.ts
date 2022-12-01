import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

test.describe('menu: basic', () => {
  configs().forEach(({ title, config }) => {
    test(title('should open selected menu by side'), async ({ page }) => {
      await page.goto(`/src/components/menu/test/basic`, config);

      const startMenu = page.locator('[menu-id="start-menu"]');
      const customMenu = page.locator('[menu-id="custom-menu"]');
      const endMenu = page.locator('[menu-id="end-menu"]');

      await testMenu(page, startMenu, 'start');
      await testMenu(page, customMenu, 'custom');
      await testMenu(page, endMenu, 'end');
    });
  });
  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should preserve scroll position'), async ({ page, skip }) => {
      skip.browser('firefox', 'Firefox does not preserve scroll position');
      await page.goto(`/src/components/menu/test/basic`, config);
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');

      await page.click('#open-start');
      await ionDidOpen.next();

      await page.locator('#start-menu ion-content').evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollToPoint(0, 200);
      });

      await page.locator('#start-menu').evaluate(async (el: HTMLIonMenuElement) => {
        await el.close();
      });

      await page.click('#open-start');
      await ionDidOpen.next();

      const scrollTop = await page.locator('#start-menu ion-content').evaluate(async (el: HTMLIonContentElement) => {
        const contentScrollEl = await el.getScrollElement();
        return contentScrollEl.scrollTop;
      });

      await expect(scrollTop).toBe(200);
    });
  });
});

async function testMenu(page: E2EPage, menu: Locator, menuId: string) {
  const ionDidOpen = await page.spyOnEvent('ionDidOpen');
  const ionDidClose = await page.spyOnEvent('ionDidClose');

  await page.click(`#open-${menuId}`);
  await ionDidOpen.next();

  await expect(menu).toHaveClass(/show-menu/);

  expect(await page.screenshot()).toMatchSnapshot(`menu-basic-${menuId}-${page.getSnapshotSettings()}.png`);

  await menu.evaluate(async (el: HTMLIonMenuElement) => {
    await el.close();
  });
  await ionDidClose.next();
}
