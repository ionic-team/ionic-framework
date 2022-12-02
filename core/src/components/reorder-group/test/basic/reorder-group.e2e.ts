import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('reorder group: basic', () => {
    test(title('should render the handle when reorder group is enabled'), async ({ page }) => {
      await page.setContent(
        `
        <ion-reorder-group disabled="false">
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      `,
        config
      );
      const reorder = page.locator('ion-reorder');
      await expect(reorder).toBeVisible();
    });
    test(title('should not render the handle when reorder group is disabled'), async ({ page }) => {
      await page.setContent(
        `
        <ion-reorder-group disabled="true">
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      `,
        config
      );
      const reorder = page.locator('ion-reorder');
      await expect(reorder).toBeHidden();
    });
  });
});
