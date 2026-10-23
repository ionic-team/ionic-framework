import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: icon'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/icon`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-icon`));
    });
  });
});

/**
 * This behavior does not vary across modes or directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('button: icon only'), () => {
    test('should only show the icon and badges with a vertical position', async ({ page }) => {
      await page.setContent(
        `
        <ion-button id="plain"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
        <ion-button id="extra">
          <ion-icon slot="start" name="star"></ion-icon>
          <ion-icon slot="icon-only" name="add"></ion-icon>
          Add item
          <ion-badge id="inline-badge">3</ion-badge>
          <ion-badge id="vertical-badge" vertical="top">3</ion-badge>
          <ion-icon slot="end" name="star"></ion-icon>
        </ion-button>
      `,
        config
      );

      const extra = page.locator('#extra');

      await expect(extra.locator('[slot="start"]')).toBeHidden();
      await expect(extra.locator('[slot="end"]')).toBeHidden();
      await expect(page.locator('#inline-badge')).toBeHidden();
      await expect(page.locator('#vertical-badge')).toBeVisible();

      // The hidden text takes no space, so the button stays the size of a plain icon-only button
      const plainBox = await page.locator('#plain').boundingBox();
      const extraBox = await extra.boundingBox();
      expect(extraBox!.width).toBe(plainBox!.width);
      expect(extraBox!.height).toBe(plainBox!.height);
    });

    test('should use hidden text as the accessible name', async ({ page }) => {
      await page.setContent(
        `
        <ion-button><ion-icon slot="icon-only" name="add"></ion-icon>Add item</ion-button>
      `,
        config
      );

      await expect(page.getByRole('button')).toHaveAccessibleName('Add item');
    });
  });
});
