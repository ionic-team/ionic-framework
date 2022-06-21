import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('img: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/img/test/basic');

    const ionImgDidLoad = await page.spyOnEvent('ionImgDidLoad');

    await page.setIonViewport();

    await ionImgDidLoad.next();

    expect(await page.screenshot()).toMatchSnapshot(`img-basic-${page.getSnapshotSettings()}.png`);
  });
});
