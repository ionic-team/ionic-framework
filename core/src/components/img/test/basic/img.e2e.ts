import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('img: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/img/test/basic');

    /**
     * The first `ion-img` resolves before the spy can be created,
     * since the image is initially visible and the IO fires.
     *
     * We manually look at the image's completion state to determine
     * that it loaded, before creating a spy for the second image.
     */
    const img = await page.locator('.img-part img');
    await img.evaluate((el: HTMLImageElement) => el.complete);

    const ionImgDidLoad = await page.spyOnEvent('ionImgDidLoad');
    /**
     * Resizing the viewport will cause the intersection observers of
     * the remaining images to fire, which will cause the `ionImgDidLoad`
     * event to fire.
     */
    await page.setIonViewport();

    await ionImgDidLoad.next();

    expect(await page.screenshot()).toMatchSnapshot(`img-basic-${page.getSnapshotSettings()}.png`);
  });
});
