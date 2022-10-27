import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('menu: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/menu/test/basic`);
  });

  test('should open selected menu by side', async ({ page }) => {
    const startMenu = page.locator('[menu-id="start-menu"]');
    const customMenu = page.locator('[menu-id="custom-menu"]');
    const endMenu = page.locator('[menu-id="end-menu"]');

    await testMenu(page, startMenu, '#open-start');
    await testMenu(page, customMenu, '#open-custom');
    await testMenu(page, endMenu, '#open-end');
  });

  test('should trap focus', async ({ page, skip, browserName }) => {
    skip.rtl('Trapping focus is not dependent on document direction');
    skip.browser('firefox', 'Firefox incorrectly allows keyboard focus to move to ion-content');

    const ionDidOpen = await page.spyOnEvent('ionDidOpen');

    await page.click('#open-start');
    await ionDidOpen.next();

    const button = await page.locator('#start-menu-button');

    if (browserName === 'webkit') {
      await page.keyboard.down('Alt');
    }

    await page.keyboard.press('Tab');

    await expect(button).toBeFocused();

    await page.keyboard.press('Tab');

    if (browserName === 'webkit') {
      await page.keyboard.up('Alt');
    }

    await expect(button).toBeFocused();
  });

  test('should preserve scroll position', async ({ page, skip }) => {
    skip.rtl('Scroll position is not dependent on document direction');
    skip.browser('firefox', 'Firefox does not preserve scroll position');

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

async function testMenu(page: E2EPage, menu: Locator, button: string) {
  const ionDidOpen = await page.spyOnEvent('ionDidOpen');
  const ionDidClose = await page.spyOnEvent('ionDidClose');

  await page.click(button);
  await ionDidOpen.next();

  await expect(menu).toHaveClass(/show-menu/);

  await menu.evaluate(async (el: HTMLIonMenuElement) => {
    await el.close();
  });
  await ionDidClose.next();
}
