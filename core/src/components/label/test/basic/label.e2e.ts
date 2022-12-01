import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('label: rendering', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setContent(
        `
        <ion-label>My Label</ion-label>
      `,
        config
      );

      const labelEl = page.locator('ion-label');

      expect(await labelEl.screenshot()).toMatchSnapshot(`label-basic-${page.getSnapshotSettings()}.png`);
    });
    test(title('should not have visual regressions with fixed label'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label>My Label</ion-label>
        </ion-item>
      `,
        config
      );

      const itemEl = page.locator('ion-item');

      expect(await itemEl.screenshot()).toMatchSnapshot(`label-fixed-${page.getSnapshotSettings()}.png`);
    });
    test(title('should not have visual regressions with stacked label'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label position="stacked">My Label</ion-label>
          <ion-input></ion-input>
        </ion-item>
      `,
        config
      );

      const itemEl = page.locator('ion-item');

      expect(await itemEl.screenshot()).toMatchSnapshot(`label-stacked-${page.getSnapshotSettings()}.png`);
    });
    test(title('should not have visual regressions with floating label'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label position="floating">My Label</ion-label>
          <ion-input></ion-input>
        </ion-item>
      `,
        config
      );

      const itemEl = page.locator('ion-item');

      expect(await itemEl.screenshot()).toMatchSnapshot(`label-floating-${page.getSnapshotSettings()}.png`);
    });
  });
});
