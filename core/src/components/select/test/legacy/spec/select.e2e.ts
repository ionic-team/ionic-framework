import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: spec', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/select/test/legacy/spec`);

    await page.setIonViewport();

    expect(await page.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `select-spec-diff-${page.getSnapshotSettings()}.png`
    );
  });
});
