import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: color', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/datetime/test/color');

    const colorSelect = page.locator('ion-select');
    const darkModeToggle = page.locator('ion-checkbox');
    const datetime = page.locator('ion-datetime');

    await darkModeToggle.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
    await page.waitForChanges();

    expect(await datetime.first().screenshot()).toMatchSnapshot(
      `datetime-color-default-dark-${page.getSnapshotSettings()}.png`
    );
    expect(await datetime.last().screenshot()).toMatchSnapshot(
      `datetime-color-custom-dark-${page.getSnapshotSettings()}.png`
    );

    await darkModeToggle.evaluate((el: HTMLIonCheckboxElement) => (el.checked = false));
    await colorSelect.evaluate((el: HTMLIonSelectElement) => (el.value = 'danger'));
    await page.waitForChanges();

    expect(await datetime.first().screenshot()).toMatchSnapshot(
      `datetime-color-default-light-color-${page.getSnapshotSettings()}.png`
    );
    expect(await datetime.last().screenshot()).toMatchSnapshot(
      `datetime-color-custom-light-color-${page.getSnapshotSettings()}.png`
    );

    await darkModeToggle.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
    await page.waitForChanges();

    expect(await datetime.first().screenshot()).toMatchSnapshot(
      `datetime-color-default-dark-color-${page.getSnapshotSettings()}.png`
    );
    expect(await datetime.last().screenshot()).toMatchSnapshot(
      `datetime-color-custom-dark-color-${page.getSnapshotSettings()}.png`
    );
  });
});
