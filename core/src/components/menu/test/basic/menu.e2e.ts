import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage, ScreenshotFn } from '@utils/test/playwright';
import { configs, dragElementBy, test } from '@utils/test/playwright';

configs().forEach(({ title, config, screenshot }) => {
  test.describe(title('menu: rendering'), () => {
    test('should open selected menu by side', async ({ page }) => {
      await page.goto(`/src/components/menu/test/basic`, config);
      const startMenu = page.locator('[menu-id="start-menu"]');
      const customMenu = page.locator('[menu-id="custom-menu"]');
      const endMenu = page.locator('[menu-id="end-menu"]');

      await testMenu(page, startMenu, 'start', screenshot);
      await testMenu(page, customMenu, 'custom', screenshot);
      await testMenu(page, endMenu, 'end', screenshot);
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: functionality'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu/test/basic`, config);
    });

    test('should trap focus', async ({ page, skip, browserName }) => {
      skip.browser('firefox', 'Firefox incorrectly allows keyboard focus to move to ion-content');
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');

      await page.click('#open-start');
      await ionDidOpen.next();

      const button = page.locator('#start-menu-button');

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
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('menu: reactive side'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu/test/basic`, config);
    });
    test('should render on the correct side when side is changed dynamically', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25601',
      });

      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.locator('[menu-id="start-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
        el.side = 'end';
      });
      await page.click('#open-start');
      await ionDidOpen.next();

      await expect(page).toHaveScreenshot(screenshot(`menu-basic-side-toggled`));

      await page.locator('[menu-id="start-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
        await el.close();
      });
      await ionDidClose.next();
    });

    test('should render on the correct side when document direction is changed dynamically', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25601',
      });

      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.evaluate(() => {
        document.dir = 'rtl';
      });
      await page.click('#open-start');
      await ionDidOpen.next();

      await expect(page).toHaveScreenshot(screenshot(`menu-basic-doc-dir-toggled`));

      await page.locator('[menu-id="start-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
        await el.close();
      });
      await ionDidClose.next();
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: events'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu/test/basic`, config);
    });

    test('should pass role when swiping to close', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionWillClose = await page.spyOnEvent('ionWillClose');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.click('#open-start');
      await ionDidOpen.next();

      const menu = page.locator('#start-menu');
      await dragElementBy(menu, page, -150, 0);

      await ionWillClose.next();
      await ionDidClose.next();
      await expect(ionWillClose).toHaveReceivedEventDetail({ role: 'gesture' });
      await expect(ionDidClose).toHaveReceivedEventDetail({ role: 'gesture' });
    });

    test('should pass role when clicking backdrop to close', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionWillClose = await page.spyOnEvent('ionWillClose');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.click('#open-start');
      await ionDidOpen.next();

      const menu = page.locator('#start-menu');
      const backdrop = menu.locator('ion-backdrop');

      /**
       * Coordinates for the click event.
       * These need to be near the right edge of the backdrop
       * in order to avoid clicking on the menu.
       */
      const backdropBoundingBox = await backdrop.boundingBox();
      const x = backdropBoundingBox!.width - 50;
      const y = backdropBoundingBox!.height - 50;

      // Click near the right side of the backdrop.
      await backdrop.click({
        position: { x, y },
      });

      await ionWillClose.next();
      await ionDidClose.next();
      await expect(ionWillClose).toHaveReceivedEventDetail({ role: 'backdrop' });
      await expect(ionDidClose).toHaveReceivedEventDetail({ role: 'backdrop' });
    });

    test('should pass role when pressing escape key to close', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionWillClose = await page.spyOnEvent('ionWillClose');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.click('#open-start');
      await ionDidOpen.next();

      await page.keyboard.press('Escape');

      await ionWillClose.next();
      await ionDidClose.next();
      await expect(ionWillClose).toHaveReceivedEventDetail({ role: 'backdrop' });
      await expect(ionDidClose).toHaveReceivedEventDetail({ role: 'backdrop' });
    });

    test('should not pass role when clicking a menu toggle button to close', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionWillClose = await page.spyOnEvent('ionWillClose');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await page.click('#open-start');
      await ionDidOpen.next();

      await page.click('#start-menu-button');

      await ionWillClose.next();
      await ionDidClose.next();
      await expect(ionWillClose).toHaveReceivedEventDetail({ role: undefined });
      await expect(ionDidClose).toHaveReceivedEventDetail({ role: undefined });
    });
  });
});

async function testMenu(page: E2EPage, menu: Locator, menuId: string, screenshot: ScreenshotFn) {
  const ionDidOpen = await page.spyOnEvent('ionDidOpen');
  const ionDidClose = await page.spyOnEvent('ionDidClose');

  await page.click(`#open-${menuId}`);
  await ionDidOpen.next();

  await expect(menu).toHaveClass(/show-menu/);

  await expect(page).toHaveScreenshot(screenshot(`menu-basic-${menuId}`));

  await menu.evaluate(async (el: HTMLIonMenuElement) => {
    await el.close();
  });
  await ionDidClose.next();
}
