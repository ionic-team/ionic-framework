import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
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
    const attribute = alert.evaluate((el: HTMLIonPopoverElement) => el.getAttribute('data-testid'));
    expect(attribute).toEqual('basic-popover');
  });
});

test.describe('popover: focus trap', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/popover/test/basic');
  });

  test('should focus the first ion-item on ArrowDown', async ({ page }) => {
    await openPopover(page, 'basic-popover');

    await page.keyboard.press('ArrowDown');
    await expectActiveElementTextToEqual(page, 'Item 0');
  });

  test('should trap focus', async ({ page }) => {
    await openPopover(page, 'basic-popover');

    await page.keyboard.press('Tab');

    await expectActiveElementTextToEqual(page, 'Item 0');

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    await expectActiveElementTextToEqual(page, 'Item 3');

    await page.keyboard.press('Tab');

    await expectActiveElementTextToEqual(page, 'Item 0');

    await page.keyboard.press('ArrowDown');

    await expectActiveElementTextToEqual(page, 'Item 1');

    await page.keyboard.press('ArrowDown');

    await expectActiveElementTextToEqual(page, 'Item 2');

    await page.keyboard.press('Home');

    await expectActiveElementTextToEqual(page, 'Item 0');

    await page.keyboard.press('End');

    await expectActiveElementTextToEqual(page, 'Item 3');
  });

  test('should not override keyboard interactions for textarea elements', async ({ page }) => {
    await openPopover(page, 'popover-with-textarea');
    await page.waitForFunction(() => document.activeElement?.tagName === 'ION-POPOVER');

    await page.keyboard.press('Tab');
    // Checking within ion-textarea

    let activeElementTagName = await page.evaluate(() => document.activeElement!.tagName);
    let scrollTop = null;
    let selectionStart = null;
    let previousSelectionStart = null;

    // This is the native textarea within ion-textarea
    expect(activeElementTagName).toBe('TEXTAREA');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBe(0);

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(0);
    previousSelectionStart = selectionStart;

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(previousSelectionStart!);

    await page.keyboard.press('Tab');
    // Checking within HTML textarea

    // Reset tracking variables as the focus element has changed
    scrollTop = null;
    selectionStart = null;
    previousSelectionStart = null;

    activeElementTagName = await page.evaluate(() => document.activeElement!.tagName);
    expect(activeElementTagName).toBe('TEXTAREA');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBe(0);

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(0);
    previousSelectionStart = selectionStart;

    await page.keyboard.press('ArrowDown');

    selectionStart = await getActiveElementSelectionStart(page);
    expect(selectionStart).toBeGreaterThan(previousSelectionStart!);

    await page.keyboard.press('Home');

    scrollTop = await getActiveElementScrollTop(page);
    expect(scrollTop).toBeGreaterThan(0);

    const previousScrollTop = scrollTop;

    await page.keyboard.press('End');

    scrollTop = await getActiveElementScrollTop(page);
    expect(scrollTop).toBeGreaterThanOrEqual(previousScrollTop);
  });
});

/**
 * Focusing happens async inside of popover so we need
 * to wait for the requestAnimationFrame to fire.
 */
const expectActiveElementTextToEqual = async (page: E2EPage, textValue: string) => {
  await page.evaluate((text) => document.activeElement!.textContent === text, textValue);
};

const getActiveElementSelectionStart = (page: E2EPage) => {
  return page.evaluate(() =>
    document.activeElement instanceof HTMLTextAreaElement ? document.activeElement.selectionStart : null
  );
};

const getActiveElementScrollTop = (page: E2EPage) => {
  return page.evaluate(() => {
    // Returns the closest ion-textarea or active element
    const target = document.activeElement!.closest('ion-textarea') ?? document.activeElement;
    return target!.scrollTop;
  });
};
