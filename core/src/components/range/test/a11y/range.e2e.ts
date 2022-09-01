import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

const mouseDownRangeHandle = async (page: E2EPage, rangeHandle: Locator) => {
  const box = (await rangeHandle.boundingBox())!;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
};

test.describe('range: a11y', () => {
  test('should not have visual regressions', async ({ page, skip, browserName }) => {
    skip.rtl();
    skip.mode('ios', 'iOS mode does not display hover/active/focus styles.');

    await page.setContent(
      `<ion-app>
        <ion-content>
          <ion-range min="0" max="100" value="80"></ion-range>
        </ion-content>
      </ion-app>
        `
    );

    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    const range = page.locator('ion-range');
    const rangeHandle = range.locator('.range-knob-handle');

    await page.keyboard.press(tabKey);
    await page.waitForChanges();

    expect(await range.screenshot()).toMatchSnapshot(`range-focus-${page.getSnapshotSettings()}.png`);

    await mouseDownRangeHandle(page, rangeHandle);
    await page.waitForChanges();

    expect(await range.screenshot()).toMatchSnapshot(`range-active-${page.getSnapshotSettings()}.png`);
  });

  test.describe('with pin', () => {
    test('should not have visual regressions', async ({ page, skip }) => {
      skip.rtl();

      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="50" pin="true"></ion-range>
          </ion-content>
        </ion-app>
        `
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      await mouseDownRangeHandle(page, rangeHandle);
      await page.waitForChanges();

      expect(await range.screenshot()).toMatchSnapshot(`range-focus-with-pin-${page.getSnapshotSettings()}.png`);
    });
  });
});
