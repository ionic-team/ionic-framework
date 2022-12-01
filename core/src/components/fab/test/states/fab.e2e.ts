import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test(title('should not have visual regressions'), async ({ page }) => {
    await page.goto(`/src/components/fab/test/states`, config);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`fab-states-${page.getSnapshotSettings()}.png`);
  });
});
