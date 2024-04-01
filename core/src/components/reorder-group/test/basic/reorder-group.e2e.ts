import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * Reorder group does not have per-mode styles
 */
configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('reorder group: basic'),
    () => {
      test('should render the handle when reorder group is enabled', async ({
        page,
      }) => {
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
        const reorder = page.locator(
          'ion-reorder'
        );
        await expect(
          reorder
        ).toBeVisible();
      });
      test('should not render the handle when reorder group is disabled', async ({
        page,
      }) => {
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
        const reorder = page.locator(
          'ion-reorder'
        );
        await expect(
          reorder
        ).toBeHidden();
      });
    }
  );
});
