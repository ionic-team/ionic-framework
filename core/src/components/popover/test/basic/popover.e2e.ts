import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

test.describe('popover: rendering', async () => {
  test('should not have visual regressions', async ({ page }) => {
    const buttonIDs = [
      'basic-popover',
      'translucent-popover',
      'long-list-popover',
      'no-event-popover',
      'custom-class-popover',
      'header-popover',
      'translucent-header-popover',
    ];

    for (const id of buttonIDs) {
      await screenshotPopover(page, id, 'basic');
    }
  });
});

test.describe('popover: htmlAttributes', async () => {
  test('should inherit attributes on host', async ({ page }) => {
    await page.goto('/src/components/popover/test/basic');
    await openPopover(page, 'basic-popover');

    const alert = page.locator('ion-popover');
    await expect(alert).toHaveAttribute('data-testid', 'basic-popover');
  });
});

test.describe('popover: focus trap', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/popover/test/basic');
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
    const innerNativeTextarea = page.locator('ion-textarea textarea');
    const vanillaTextarea = page.locator('ion-textarea + textarea');

    await openPopover(page, 'popover-with-textarea');

    /**
     * Focusing happens async inside of popover so we need
     * to wait for the requestAnimationFrame to fire.
     */
    await page.waitForFunction(() => document.activeElement?.tagName === 'ION-POPOVER');

    await page.keyboard.press(tabKey);

    // for Firefox, ion-textarea is focused first
    // need to tab again to get to native input
    if (browserName === 'firefox') {
      await page.keyboard.press(tabKey);
    }

    let scrollTop = null;
    let selectionStart = null;
    let previousSelectionStart = null;

    await expect(innerNativeTextarea).toBeFocused();

    selectionStart = await getSelectionStart(innerNativeTextarea);
    expect(selectionStart).toBe(0);

    await page.keyboard.press('ArrowDown');

    selectionStart = await getSelectionStart(innerNativeTextarea);
    expect(selectionStart).toBeGreaterThan(0);
    previousSelectionStart = selectionStart;

    await page.keyboard.press('ArrowDown');

    selectionStart = await getSelectionStart(innerNativeTextarea);
    expect(selectionStart).toBeGreaterThan(previousSelectionStart);

    await page.keyboard.press(tabKey);
    // Checking within HTML textarea

    // Reset tracking variables as the focus element has changed
    selectionStart = null;
    previousSelectionStart = null;

    await expect(vanillaTextarea).toBeFocused();

    selectionStart = await getSelectionStart(vanillaTextarea);
    expect(selectionStart).toBe(0);

    await page.keyboard.press('ArrowDown');

    selectionStart = await getSelectionStart(vanillaTextarea);
    expect(selectionStart).toBeGreaterThan(0);
    previousSelectionStart = selectionStart;

    await page.keyboard.press('ArrowDown');

    selectionStart = await getSelectionStart(vanillaTextarea);
    expect(selectionStart).toBeGreaterThan(previousSelectionStart!);

    await page.keyboard.press('Home');

    scrollTop = await getScrollTop(vanillaTextarea);
    expect(scrollTop).toBeGreaterThan(0);

    const previousScrollTop = scrollTop;

    await page.keyboard.press('End');

    scrollTop = await getScrollTop(vanillaTextarea);
    expect(scrollTop).toBeGreaterThanOrEqual(previousScrollTop);
  });
});

const getSelectionStart = (el: Locator) => {
  return el.evaluate((el) => (el as HTMLTextAreaElement).selectionStart);
};

const getScrollTop = (el: Locator) => {
  return el.evaluate((el) => (el as HTMLTextAreaElement).scrollTop);
};
