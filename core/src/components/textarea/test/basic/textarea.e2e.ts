import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/textarea/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`textarea-diff-${page.getSnapshotSettings()}.png`);
  });

  test.describe('with floating labels', () => {
    /**
     * Verifies the display of a floating label above an `ion-textarea`.
     * Captures a screenshot of the initial state (without a value) and verifies
     * that the label translates correctly after the value is set.
     */
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-item>
        <ion-label color="primary" position="floating">Floating Label</ion-label>
        <ion-textarea value=""></ion-textarea>
      </ion-item>`);

      const item = page.locator('ion-item');

      expect(await item.screenshot()).toMatchSnapshot(`textarea-floating-label-initial-${page.getSnapshotSettings()}.png`);

      const textarea = page.locator('textarea');
      await textarea.evaluate((el: HTMLIonTextareaElement) => {
        el.value = 'Updated value';
      });

      await page.waitForChanges();

      await page.setIonViewport();

      expect(await item.screenshot()).toMatchSnapshot(`textarea-floating-label-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
