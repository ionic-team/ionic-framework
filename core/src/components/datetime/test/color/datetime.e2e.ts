import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: color', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/datetime/test/color');

    const datetime = page.locator('ion-datetime');

    await page.evaluate(() => document.body.classList.toggle('dark'));
    await page.waitForChanges();

    expect(await datetime.first().screenshot()).toMatchSnapshot(
      `datetime-color-default-dark-${page.getSnapshotSettings()}.png`
    );
    expect(await datetime.last().screenshot()).toMatchSnapshot(
      `datetime-color-custom-dark-${page.getSnapshotSettings()}.png`
    );

    await page.evaluate(() => document.body.classList.toggle('dark'));
    await datetime.evaluateAll((els: HTMLIonDatetimeElement[]) => {
      els.forEach((el) => (el.color = 'danger'));
    });
    await page.waitForChanges();

    expect(await datetime.first().screenshot()).toMatchSnapshot(
      `datetime-color-default-light-color-${page.getSnapshotSettings()}.png`
    );
    expect(await datetime.last().screenshot()).toMatchSnapshot(
      `datetime-color-custom-light-color-${page.getSnapshotSettings()}.png`
    );

    await page.evaluate(() => document.body.classList.toggle('dark'));
    await page.waitForChanges();

    expect(await datetime.first().screenshot()).toMatchSnapshot(
      `datetime-color-default-dark-color-${page.getSnapshotSettings()}.png`
    );
    expect(await datetime.last().screenshot()).toMatchSnapshot(
      `datetime-color-custom-dark-color-${page.getSnapshotSettings()}.png`
    );
  });
});
