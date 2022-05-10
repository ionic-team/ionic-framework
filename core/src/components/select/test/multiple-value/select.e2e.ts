import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: multiple-value', () => {
  test('should open multiple value select', async ({ page }) => {
    await page.goto(`/src/components/select/test/multiple-value`);

    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

    await page.click('#toppings');

    await ionAlertDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`select-multiple-value-diff-${page.getSnapshotSettings()}.png`);
  });
});
