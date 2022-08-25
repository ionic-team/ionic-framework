import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: a11y', () => {
  test.describe('focus state', () => {
    test('should not have visual regressions', async ({ page, skip, browserName }) => {
      skip.rtl();
      skip.mode('ios', 'iOS mode does not display focus styles or the pin on focus.');

      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range id="withPin" min="0" max="100" value="50" pin="true"></ion-range>
            <ion-range id="withoutPin" min="0" max="100" value="80"></ion-range>
          </ion-content>
        </ion-app>
        `
      );

      const rangeWithPin = page.locator('ion-range#withPin');
      const rangeWithoutPin = page.locator('ion-range#withoutPin');
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      expect(await rangeWithPin.screenshot()).toMatchSnapshot(`range-focus-with-pin-${page.getSnapshotSettings()}.png`);

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      expect(await rangeWithoutPin.screenshot()).toMatchSnapshot(
        `range-focus-without-pin-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
