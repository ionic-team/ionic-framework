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
 * These assert `ion-focusable`, not the rendered ring, because `ion-focused`
 * relies on keyboard-mode detection that is flaky on WebKit. Gating is mode-independent.
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
      await expect(toggle).not.toHaveClass(/toggle-defers-indicator/);
    });

    test('toggle in a single-input item should defer the indicator to the item', async ({ page }) => {
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

      const toggle = page.locator('ion-toggle');

      // The toggle's `ion-focusable` is what makes the item focusable, so both carry it.
      await expect(toggle).toHaveClass(/ion-focusable/);
      await expect(toggle).toHaveClass(/toggle-defers-indicator/);
      await expect(page.locator('ion-item')).toHaveClass(/ion-focusable/);
    });

    test('toggle in a clickable item should keep its own indicator', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item button>
            <ion-toggle>Toggle</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');

      // Two tab stops sharing one indicator would be indistinguishable.
      await expect(page.locator('ion-item')).toHaveClass(/ion-activatable/);
      await expect(toggle).not.toHaveClass(/toggle-defers-indicator/);
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

      // No single indicator to defer to, so each toggle draws its own.
      await expect(toggles.nth(0)).not.toHaveClass(/toggle-defers-indicator/);
      await expect(toggles.nth(1)).not.toHaveClass(/toggle-defers-indicator/);
    });
  });
});
