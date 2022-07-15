import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: a11y', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not test LTR vs RTL logic.');
  });
  test('tabbing should switch between radio groups', async ({ page, browserName }) => {
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.goto(`/src/components/radio/test/a11y`);

    const firstGroupRadios = page.locator('#first-group ion-radio');
    const secondGroupRadios = page.locator('#second-group ion-radio');

    await page.keyboard.press(tabKey);
    await expect(firstGroupRadios.nth(0)).toBeFocused();

    await page.keyboard.press(tabKey);
    await expect(secondGroupRadios.nth(0)).toBeFocused();

    await page.keyboard.press(`Shift+${tabKey}`);
    await expect(firstGroupRadios.nth(0)).toBeFocused();
  });
  test('using arrow keys should move between enabled radios within group', async ({ page, browserName }) => {
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
