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

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      const rangeWithPin = page.locator('ion-range#withPin');

      const range = page.locator('ion-range#withoutPin');
      const rangeHandle = page.locator('ion-range#withoutPin .range-knob-handle');

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      expect(await rangeWithPin.screenshot()).toMatchSnapshot(`range-focus-with-pin-${page.getSnapshotSettings()}.png`);

      await rangeHandle.hover();
      await page.waitForChanges();

      expect(await range.screenshot()).toMatchSnapshot(
        `range-focus-without-pin-hover-${page.getSnapshotSettings()}.png`
      );

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      expect(await range.screenshot()).toMatchSnapshot(
        `range-focus-without-pin-focus-${page.getSnapshotSettings()}.png`
      );

      await rangeHandle.click();
      await page.waitForChanges();

      expect(await range.screenshot()).toMatchSnapshot(
        `range-focus-without-pin-active-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
