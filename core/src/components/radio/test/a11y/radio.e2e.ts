import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: a11y', () => {
  test.beforeEach(async ({ skip }) => {
    skip.rtl();
    skip.mode('md');
  });

  test('should not have accessibility violations', async ({ page }) => {
    await page.goto(`/src/components/radio/test/a11y`);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  // TODO FW-3747
  test.skip('using arrow keys should move between enabled radios within group', async ({ page, browserName }) => {
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.goto(`/src/components/radio/test/a11y`);

    const firstGroupRadios = page.locator('#first-group ion-radio');

    await page.keyboard.press(tabKey);
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
