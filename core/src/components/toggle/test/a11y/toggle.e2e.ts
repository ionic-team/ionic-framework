import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-toggle>my label</ion-toggle>
          <ion-toggle aria-label="my aria label"></ion-toggle>
          <ion-toggle checked="true">Checked</ion-toggle>
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
 * These assert the `ion-focusable` class the component controls, not the
 * rendered ring. `ion-focused` is not asserted directly because it depends on
 * keyboard-mode detection, which is unreliable on WebKit. The class is
 * mode-independent, so only md is exercised.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: focus indicator'), () => {
    test('standalone toggle should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-toggle aria-label="Toggle">Toggle</ion-toggle>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveClass(/ion-focusable/);
    });

    test('toggle in a single-input item should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-toggle>Toggle</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      // Unlike checkbox/radio, a single-input item does not suppress a toggle's
      // own indicator.
      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveClass(/ion-focusable/);
    });

    test('toggle in a multi-input item should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-toggle>Toggle 1</ion-toggle>
            <ion-toggle>Toggle 2</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      const toggles = page.locator('ion-toggle');
      await expect(toggles.nth(0)).toHaveClass(/ion-focusable/);
      await expect(toggles.nth(1)).toHaveClass(/ion-focusable/);
    });
  });
});
