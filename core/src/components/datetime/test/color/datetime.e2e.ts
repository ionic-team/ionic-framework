import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: color'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="width: 250px;">
          <ion-datetime
            color="danger"
            value="2022-05-03"
            show-default-title="true"
            show-default-buttons="true"
          ></ion-datetime>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await page.locator('.datetime-ready').waitFor();

      await expect(container).toHaveScreenshot(screenshot(`datetime-color`));
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: color'), () => {
    test('should apply color to the time button when opened', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="width: 250px;">
          <ion-datetime
            color="danger"
            value="2022-05-03T14:30:00"
            presentation="date-time"
            show-default-title="true"
            show-default-buttons="true"
          ></ion-datetime>
        </div>
      `,
        config
      );

      await page.locator('.datetime-ready').waitFor();

      const timeBody = page.locator('.time-body');

      await timeBody.click();

      const timeBodyActive = page.locator('.time-body-active');
      const activeTimeBodyStyles = await timeBodyActive.evaluate((el) => {
        const rgbToHex = (rgb: string): string => {
          const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          if (!match) return rgb;
          const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
          const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
          const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        };

        const styles = window.getComputedStyle(el);
        return {
          color: rgbToHex(styles.color),
          colorBase: styles.getPropertyValue('--ion-color-base').trim(),
        };
      });

      // Computed color should match the danger color's base value from the CSS custom property
      expect(activeTimeBodyStyles.color).toEqual(activeTimeBodyStyles.colorBase);
    });
  });
});

/**
 * This behavior only applies to `md`
 */
configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: color'), () => {
    test('should apply color to the selected time option when opened', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="width: 250px;">
          <ion-datetime
            color="danger"
            value="2022-05-03T14:30:00"
            presentation="date-time"
            show-default-title="true"
            show-default-buttons="true"
          ></ion-datetime>
        </div>
      `,
        config
      );

      await page.locator('.datetime-ready').waitFor();

      const timeBody = page.locator('.time-body');

      await timeBody.click();

      const option = page.locator('ion-picker-column-option[part~="active"]').first();

      const optionStyles = await option.evaluate((el) => {
        const rgbToHex = (rgb: string): string => {
          const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          if (!match) return rgb;
          const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
          const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
          const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        };

        const styles = window.getComputedStyle(el);
        return {
          color: rgbToHex(styles.color),
          colorBase: styles.getPropertyValue('--ion-color-base').trim(),
        };
      });

      // Selected time option color should match the danger color's base value
      expect(optionStyles.color).toEqual(optionStyles.colorBase);
    });
  });
});
