import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';
import { PageUtils } from '@utils/test/press-keys';

test.describe('radio: a11y', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('tabbing should switch between radio groups', async ({ page }) => {
    const pageUtils = new PageUtils({ page });
    await page.goto(`/src/components/radio/test/legacy/a11y`);

    const firstGroupRadios = page.locator('#first-group ion-radio');
    const secondGroupRadios = page.locator('#second-group ion-radio');

    await pageUtils.pressKeys('Tab');
    await expect(firstGroupRadios.nth(0)).toBeFocused();

    await pageUtils.pressKeys('Tab');
    await expect(secondGroupRadios.nth(0)).toBeFocused();

    await pageUtils.pressKeys('shift+Tab');
    await expect(firstGroupRadios.nth(0)).toBeFocused();
  });
  test('using arrow keys should move between enabled radios within group', async ({ page }) => {
    const pageUtils = new PageUtils({ page });
    await page.goto(`/src/components/radio/test/legacy/a11y`);

    const firstGroupRadios = page.locator('#first-group ion-radio');

    await pageUtils.pressKeys('Tab');
    await expect(firstGroupRadios.nth(0)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(firstGroupRadios.nth(1)).toBeFocused();

    // firstGroupRadios.nth(2) is disabled so it should not receive focus.
    await page.keyboard.press('ArrowDown');
    await expect(firstGroupRadios.nth(3)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(firstGroupRadios.nth(0)).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(firstGroupRadios.nth(3)).toBeFocused();
  });
});
