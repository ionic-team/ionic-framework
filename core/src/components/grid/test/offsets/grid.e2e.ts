import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test(title('should not have visual regressions'), async ({ page }) => {
    await page.goto(`/src/components/grid/test/offsets`, config);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`grid-offsets-${page.getSnapshotSettings()}.png`);
  });
});
