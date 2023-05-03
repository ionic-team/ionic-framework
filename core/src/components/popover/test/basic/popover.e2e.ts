import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: rendering'), async () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`src/components/popover/test/basic`, config);

      await screenshotPopover(page, screenshot, 'basic-popover', 'basic');
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: rendering variants'), async () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`src/components/popover/test/basic`, config);

      const buttonIDs = ['long-list-popover', 'no-event-popover', 'custom-class-popover', 'header-popover'];

      for (const id of buttonIDs) {
        await screenshotPopover(page, screenshot, id, 'basic');
      }
    });
  });
});

/**
 * Translucent popovers are only available on iOS
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: translucent variants'), async () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`src/components/popover/test/basic`, config);

      const buttonIDs = ['translucent-popover', 'translucent-header-popover'];

      for (const id of buttonIDs) {
        await screenshotPopover(page, screenshot, id, 'basic');
      }
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: focus trap'), async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/popover/test/basic', config);
    });

    test('should focus the first ion-item on ArrowDown', async ({ page }) => {
      const item0 = page.locator('ion-popover ion-item:nth-of-type(1)');

      await openPopover(page, 'basic-popover');

      await page.keyboard.press('ArrowDown');
      await expect(item0).toBeFocused();
    });

    test('should trap focus', async ({ page, browserName }) => {
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const items = page.locator('ion-popover ion-item');

      await openPopover(page, 'basic-popover');

      await page.keyboard.press(tabKey);
      await expect(items.nth(0)).toBeFocused();

      await page.keyboard.press(`Shift+${tabKey}`);
      await expect(items.nth(3)).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(items.nth(0)).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(items.nth(1)).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(items.nth(2)).toBeFocused();

      await page.keyboard.press('Home');
      await expect(items.nth(0)).toBeFocused();

      await page.keyboard.press('End');
      await expect(items.nth(3)).toBeFocused();
    });

    test('should not override keyboard interactions for textarea elements', async ({ page, browserName }) => {
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const popover = page.locator('ion-popover');
      const innerNativeTextarea = page.locator('ion-textarea textarea').nth(0);
      const vanillaTextarea = page.locator('ion-textarea + textarea');

      await openPopover(page, 'popover-with-textarea');

      /**
       * Focusing happens async inside of popover so we need
       * to wait for the requestAnimationFrame to fire.
       */
      await expect(popover).toBeFocused();

      await page.keyboard.press(tabKey);

      // for Firefox, ion-textarea is focused first
      // need to tab again to get to native input
      if (browserName === 'firefox') {
        await page.keyboard.press(tabKey);
      }

      await expect(innerNativeTextarea).toBeFocused();

      await page.keyboard.press('ArrowDown');

      await expect(innerNativeTextarea).toBeFocused();

      await page.keyboard.press('ArrowUp');

      await expect(innerNativeTextarea).toBeFocused();

      await page.keyboard.press(tabKey);
      // Checking within HTML textarea

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('ArrowDown');

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('ArrowUp');

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('Home');

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('End');

      await expect(vanillaTextarea).toBeFocused();
    });
  });
});
