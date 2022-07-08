import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/input/test/basic');
  });

  test('should not have visual regressions', async ({ page }) => {
    const compares = [];

    await page.setIonViewport();

    compares.push({
      name: 'initial',
      screenshot: await page.screenshot(),
    });

    await page.click('#fullInput');

    const fullItem = page.locator('#fullItem');
    await expect(fullItem).toHaveClass(/item-has-focus/);

    compares.push({
      name: 'full input focused',
      screenshot: await page.screenshot(),
    });

    await page.click('#insetInput');

    const insetItem = page.locator('#insetItem');
    await expect(insetItem).toHaveClass(/item-has-focus/);

    compares.push({
      name: 'inset input focused',
      screenshot: await page.screenshot(),
    });

    await page.click('#noneInput');

    const noneItem = page.locator('#noneItem');
    await expect(noneItem).toHaveClass(/item-has-focus/);

    compares.push({
      name: 'no lines input focused',
      screenshot: await page.screenshot(),
    });

    for (const compare of compares) {
      expect(compare.screenshot).toMatchSnapshot(`input-diff-${compare.name}-${page.getSnapshotSettings()}.png`);
    }
  });
});
