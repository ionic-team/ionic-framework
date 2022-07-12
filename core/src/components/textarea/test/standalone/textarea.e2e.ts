import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: standalone', () => {
  /**
   * Verifies `ion-textarea` visual display when used outside of an `ion-app` component.
   */
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/textarea/test/standalone`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`textarea-standalone-diff-${page.getSnapshotSettings()}.png`);
  });
});
