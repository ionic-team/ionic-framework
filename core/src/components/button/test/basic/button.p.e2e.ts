import { expect } from '@playwright/test';
import { test } from '../../../../utils/test/utils';

test('button: basic', async ({ page }) => {
  await page.goto(`/src/components/button/test/basic`);

  expect(await page.screenshot()).toMatchSnapshot(page.getSnapshotName());
});
