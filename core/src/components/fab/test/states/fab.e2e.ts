import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test('should not have visual regressions', async ({ page, skip }) => {
  skip.rtl();
  await page.goto(`/src/components/fab/test/states`);

  await page.setIonViewport();

  expect(await page.screenshot()).toMatchSnapshot(`fab-states-${page.getSnapshotSettings()}.png`);
});
