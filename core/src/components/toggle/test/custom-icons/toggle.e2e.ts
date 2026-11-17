import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Returns the rotation, in degrees, of an element's computed transform.
 */
const getRotation = (locator: Locator) =>
  locator.evaluate((el) => {
    const { a, b } = new DOMMatrix(getComputedStyle(el).transform);
    return Math.round((Math.atan2(b, a) * 180) / Math.PI);
  });

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: custom icons'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <style>
          #container {
            display: grid;
            grid-template-columns: repeat(2, auto);
            justify-content: space-evenly;
            gap: 8px;
            padding: 16px 0;
          }
        </style>

        <div id="container">
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny">Unchecked</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny" checked>Checked</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon">Checked Icon Only</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" checked>Checked Icon Only</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny" color="secondary">Color</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny" color="secondary" checked>Color</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny" disabled>Disabled</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny" disabled checked>Disabled</ion-toggle>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-custom-icons`));
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: custom icons'), () => {
    test('should not rotate a custom checked icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle enable-on-off-labels="true" checked-icon="sunny" checked>Label</ion-toggle>
      `,
        config
      );

      const checkedIcon = page.locator('ion-toggle .toggle-switch-icon-checked');
      expect(await getRotation(checkedIcon)).toBe(0);
    });

    test('should size and inset a custom checked icon like the unchecked icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle enable-on-off-labels="true" checked-icon="moon" unchecked-icon="sunny">Label</ion-toggle>
      `,
        config
      );

      const track = await page.locator('ion-toggle .toggle-icon').boundingBox();
      const checkedIcon = await page.locator('ion-toggle .toggle-switch-icon-checked').boundingBox();
      const uncheckedIcon = await page
        .locator('ion-toggle .toggle-switch-icon:not(.toggle-switch-icon-checked)')
        .boundingBox();

      expect(checkedIcon!.width).toBeCloseTo(uncheckedIcon!.width, 0);
      expect(checkedIcon!.height).toBeCloseTo(uncheckedIcon!.height, 0);

      const checkedInset = checkedIcon!.x - track!.x;
      const uncheckedInset = track!.x + track!.width - (uncheckedIcon!.x + uncheckedIcon!.width);
      expect(checkedInset).toBeCloseTo(uncheckedInset, 0);
    });

    test('should rotate the default checked icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle enable-on-off-labels="true" checked>Label</ion-toggle>
      `,
        config
      );

      const checkedIcon = page.locator('ion-toggle .toggle-switch-icon-checked');
      expect(await getRotation(checkedIcon)).toBe(90);
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: custom icons'), () => {
    test('should size default and custom icons to fill the handle', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle id="default" enable-on-off-labels="true" checked>Default</ion-toggle>
        <ion-toggle id="custom" enable-on-off-labels="true" checked-icon="sunny" checked>Custom</ion-toggle>
      `,
        config
      );

      const handle = await page.locator('#default .toggle-inner').boundingBox();
      const defaultIcon = await page.locator('#default .toggle-switch-icon').boundingBox();
      const customIcon = await page.locator('#custom .toggle-switch-icon').boundingBox();

      expect(defaultIcon!.width).toBeCloseTo(handle!.width, 0);
      expect(customIcon!.width).toBeCloseTo(defaultIcon!.width, 0);
      expect(customIcon!.height).toBeCloseTo(defaultIcon!.height, 0);
    });
  });
});
