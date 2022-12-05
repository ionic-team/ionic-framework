import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: single-value', () => {
  test('should open single value select', async ({ page }) => {
    await page.goto(`/src/components/select/test/single-value`);

    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

    await page.click('#gender');

    await ionAlertDidPresent.next();

    expect(await page.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `select-single-value-diff-${page.getSnapshotSettings()}.png`
    );
  });
});
