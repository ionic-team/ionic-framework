import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('label: rendering', () => {
    test(title('should not inherit color from content'), async ({ page }) => {
      await page.goto(`/src/components/label/test/color`, config);

      const item = page.locator('ion-item');

      expect(await item.screenshot()).toMatchSnapshot(`item-color-inherit-${page.getSnapshotSettings()}.png`);
    });
    test(title('should set color directly'), async ({ page }) => {
      await page.setContent(
        `
        <ion-label color="danger">Label Text</ion-label>
      `,
        config
      );

      const labelEl = page.locator('ion-label');

      expect(await labelEl.screenshot()).toMatchSnapshot(`label-color-${page.getSnapshotSettings()}.png`);
    });
    test(title('should use contrast color when color is set on item'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="danger">
          <ion-label>Label Text</ion-label>
        </ion-item>
      `,
        config
      );

      const labelEl = page.locator('ion-label');

      expect(await labelEl.screenshot()).toMatchSnapshot(`label-color-contrast-${page.getSnapshotSettings()}.png`);
    });
    test(title('should override color even if color set on item'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="danger">
          <ion-label color="dark">Label Text</ion-label>
        </ion-item>
      `,
        config
      );

      const labelEl = page.locator('ion-label');

      expect(await labelEl.screenshot()).toMatchSnapshot(`label-color-override-${page.getSnapshotSettings()}.png`);
    });
  });
});
