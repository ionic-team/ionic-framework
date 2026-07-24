import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-checkbox>Label</ion-checkbox>
          <ion-checkbox aria-label="my aria label"></ion-checkbox>
          <ion-checkbox checked="true">Checked</ion-checkbox>
          <ion-item>
            <ion-checkbox>Checkbox in item</ion-checkbox>
          </ion-item>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

/**
 * These tests assert the `ion-focusable` gating class the component controls,
 * not the rendered focus ring. `ion-focused` is not asserted directly because
 * it depends on keyboard-mode detection, which is unreliable on WebKit. The
 * gating logic does not vary across modes.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: focus indicator'), () => {
    test('standalone checkbox should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-checkbox aria-label="Checkbox">Checkbox</ion-checkbox>
        </ion-app>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveClass(/ion-focusable/);
    });

    test('checkbox in a single-input item should not show its own focus indicator', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-checkbox>Checkbox</ion-checkbox>
          </ion-item>
        </ion-app>
      `,
        config
      );

      // The item owns the focus indicator for single-input items, so the
      // checkbox must not become focusable itself.
      const checkbox = page.locator('ion-checkbox');
      const item = page.locator('ion-item');
      await expect(checkbox).not.toHaveClass(/ion-focusable/);
      await expect(item).toHaveClass(/ion-focusable/);
    });

    test('checkbox in a multi-input item should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-checkbox>Checkbox 1</ion-checkbox>
            <ion-checkbox>Checkbox 2</ion-checkbox>
          </ion-item>
        </ion-app>
      `,
        config
      );

      // Multi-input items do not draw a single focus indicator, so each control
      // must be able to show its own.
      const checkboxes = page.locator('ion-checkbox');
      await expect(checkboxes.nth(0)).toHaveClass(/ion-focusable/);
      await expect(checkboxes.nth(1)).toHaveClass(/ion-focusable/);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('checkbox: a11y'), () => {
    test.describe(title('checkbox: font scaling'), () => {
      test('should scale text on larger font sizes', async ({ page }) => {
        await page.setContent(
          `
            <style>
              html {
                font-size: 310%;
              }
            </style>
            <ion-checkbox checked>Checked</ion-checkbox>
          `,
          config
        );

        const checkbox = page.locator('ion-checkbox');
        await expect(checkbox).toHaveScreenshot(screenshot('checkbox-scale'));
      });
    });
  });
});
