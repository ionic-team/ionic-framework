import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: color', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();

    await page.goto('/src/components/datetime/test/color');

    const darkModeToggle = page.locator('ion-checkbox');
    const datetime = page.locator('ion-datetime');

    // incorrect: async assert with no await
    expect(datetime).toHaveClass('test');
    expect(datetime).toHaveValue('test');

    // correct: async assert with await
    await expect(datetime).toHaveClass('abc');

    // this is a sync assert
    expect(datetime).toBe(true);

    expect(await datetime.screenshot()).toMatchSnapshot(`datetime-color-${page.getSnapshotSettings()}.png`);

    await darkModeToggle.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
    await page.waitForChanges();

    expect(await datetime.screenshot()).toMatchSnapshot(`datetime-color-dark-${page.getSnapshotSettings()}.png`);
  });
});
