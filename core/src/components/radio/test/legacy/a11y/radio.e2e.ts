import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio: a11y'), () => {
    // TODO(FW-5218)
    test('tabbing should switch between radio groups', async ({ page, pageUtils }) => {
      await page.goto(`/src/components/radio/test/legacy/a11y`, config);

      const firstGroupRadios = page.locator('#first-group ion-radio');
      const secondGroupRadios = page.locator('#second-group ion-radio');

      await pageUtils.pressKeys('Tab');
      await expect(firstGroupRadios.nth(0)).toBeFocused();

      await pageUtils.pressKeys('Tab');
      await expect(secondGroupRadios.nth(0)).toBeFocused();

      await pageUtils.pressKeys('shift+Tab');
      await expect(firstGroupRadios.nth(0)).toBeFocused();
    });
    // TODO(FW-5218)
    test('using arrow keys should move between enabled radios within group', async ({ page, pageUtils }) => {
      await page.goto(`/src/components/radio/test/legacy/a11y`, config);

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
});
