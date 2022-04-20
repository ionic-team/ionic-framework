import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('card modal: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/modal/test/card');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#card');

    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`modal-card-present-${page.getSnapshotSettings()}.png`);
  });
  test('should not have visual regressions with custom modal', async ({ page }) => {
    await page.goto('/src/components/modal/test/card');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#card-custom');

    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`modal-card-custom-present-${page.getSnapshotSettings()}.png`);
  });
  test('should not have visual regressions with stacked cards', async ({ page }) => {
    await page.goto('/src/components/modal/test/card');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#card');
    await ionModalDidPresent.next();

    await page.click('.add');
    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`modal-card-stacked-present-${page.getSnapshotSettings()}.png`);
  });
  test('should not have visual regressions with stacked custom cards', async ({ page }) => {
    await page.goto('/src/components/modal/test/card');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#card-custom');
    await ionModalDidPresent.next();

    await page.click('.add');
    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(
      `modal-card-custom-stacked-present-${page.getSnapshotSettings()}.png`
    );
  });
});
