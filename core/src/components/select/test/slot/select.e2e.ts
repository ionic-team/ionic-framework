import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('select: start and end slots (visual checks)'), () => {
    test('should not have visual regressions with a start-positioned label', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="start" fill="solid" placeholder="Select weight" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-button fill="clear" slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slots-label-start`));
    });

    test('should not have visual regressions with a floating label', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="solid" placeholder="Select weight" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
            <ion-button fill="clear" slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-slots-label-floating`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: start and end slots (functionality checks)'), () => {
    test('should raise floating label when there is content in the start slot', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="solid" label="Weight">
            <ion-icon slot="start" name="barbell" aria-hidden="true"></ion-icon>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveClass(/label-floating/);
    });

    test('should raise floating label when there is content in the end slot', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label-placement="floating" fill="solid" label="Weight">
            <ion-icon slot="end" name="barbell" aria-hidden="true"></ion-icon>
          </ion-select>
        `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveClass(/label-floating/);
    });

    test('should not open select when slotted buttons are clicked', async ({ page }) => {
      await page.setContent(
        `
          <ion-select label="Favorite Pizza" placeholder="Select a pizza">
            <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
            <ion-select-option value="supreme">Supreme</ion-select-option>
            <ion-select-option value="chicken">Chicken</ion-select-option>
            <ion-button fill="clear" slot="end" aria-label="Show/hide password">
              <ion-icon slot="icon-only" name="eye" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-select>
        `,
        config
      );

      await page.click('ion-select ion-button[slot="end"]');
      await page.waitForChanges();

      const select = page.locator('ion-select');
      await expect(select).not.toHaveClass(/select-expanded/);
    });
  });
});
