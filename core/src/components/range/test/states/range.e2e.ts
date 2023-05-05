import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: states'), () => {
    test('should render enabled state', async ({ page }) => {
      await page.setContent(
        `
        <ion-range>
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Temperature</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-enabled`));
    });
    test('should render disabled state', async ({ page }) => {
      await page.setContent(
        `
        <ion-range disabled="true">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Temperature</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-disabled`));
    });
  });
});
