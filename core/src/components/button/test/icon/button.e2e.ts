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
 * This behavior does not vary across modes or directions.
 * The ionic theme's link styles set `display`, so it also
 * checks that outside styles can't show hidden content.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('button: icon only'), () => {
    test('should only show the icon and badges with a vertical position', async ({ page }) => {
      await page.setContent(
        `
        <ion-button id="plain"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
        <ion-button id="extra">
          <a slot="start" href="#">Link</a>
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
      // Content without a slot is visually hidden, so it still names the button
      await expect(page.locator('#inline-badge')).toHaveCSS('opacity', '0');
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
        <ion-button id="bare"><ion-icon slot="icon-only" name="add"></ion-icon>Add item</ion-button>
        <ion-button id="span"><ion-icon slot="icon-only" name="add"></ion-icon><span>Add item</span></ion-button>
        <ion-button id="label"><ion-icon slot="icon-only" name="add"></ion-icon><ion-label>Add item</ion-label></ion-button>
      `,
        config
      );

      for (const id of ['bare', 'span', 'label']) {
        await expect(page.locator(`#${id}`).getByRole('button')).toHaveAccessibleName('Add item');
      }
    });
  });
});
