import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test('should not have visual regressions', async ({ page, skip }) => {
  skip.rtl();
  skip.mode('md', 'Translucency is only available on ios mode');
  await page.goto(`/src/components/fab/test/translucent`);

  const fab = page.locator('#fab5');
  await fab.click();
  await page.waitForChanges();

  // fab.screenshot doesn't work since the bounding box is just the middle button
  await page.setViewportSize({
    width: 235,
    height: 310,
  });

  expect(await page.screenshot()).toMatchSnapshot(`fab-translucent-${page.getSnapshotSettings()}.png`);
});
