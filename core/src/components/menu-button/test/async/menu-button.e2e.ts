import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('menu button: async'),
    () => {
      test('menu button should be visible if menu is moved', async ({
        page,
      }) => {
        await page.goto(
          `/src/components/menu-button/test/async`,
          config
        );

        const menu =
          page.locator('ion-menu');
        const menuButton = page.locator(
          'ion-menu-button'
        );
        const triggerButton =
          page.locator('#trigger');

        await expect(
          menu
        ).not.toBeAttached();
        await expect(
          menuButton
        ).toBeHidden();

        await triggerButton.click();

        await expect(
          menu
        ).toBeAttached();
        await expect(
          menuButton
        ).toBeVisible();
      });
    }
  );
});
