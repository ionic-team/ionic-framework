import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Returns the element's computed rotation in degrees.
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
 * Only ios rotates the checked icon, and the rotation doesn't depend on direction.
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
 * Only ios has custom checked icon styles.
 */
configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: custom icons'), () => {
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

      // The checked icon sits at the start of the track and the unchecked icon at the end.
      const trackStart = track!.x;
      const trackEnd = track!.x + track!.width;
      const isRTL = config.direction === 'rtl';
      const checkedInset = isRTL ? trackEnd - (checkedIcon!.x + checkedIcon!.width) : checkedIcon!.x - trackStart;
      const uncheckedInset = isRTL
        ? uncheckedIcon!.x - trackStart
        : trackEnd - (uncheckedIcon!.x + uncheckedIcon!.width);
      expect(checkedInset).toBeCloseTo(uncheckedInset, 0);
    });
  });
});
