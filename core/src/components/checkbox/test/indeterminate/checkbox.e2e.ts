import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: indeterminate', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();

    await page.goto(`/src/components/checkbox/test/indeterminate`);

<<<<<<< HEAD
    const checkbox = page.locator('ion-checkbox:first-child');
    expect(await checkbox.screenshot()).toMatchSnapshot(`checkbox-indeterminate-${page.getSnapshotSettings()}.png`);
=======
    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`checkbox-indeterminate-${page.getSnapshotSettings()}.png`);
>>>>>>> origin/main
  });
});
