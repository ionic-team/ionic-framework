import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('fab-button: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-fab-button>FAB</ion-fab-button>
        <ion-fab-button class="ion-activated">FAB</ion-fab-button>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe(title('fab-list: contrast'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-fab activated="true">
          <ion-fab-button>
            Open
          </ion-fab-button>
          <ion-fab-list side="bottom">
            <ion-fab-button>Down</ion-fab-button>
            <ion-fab-button class="ion-activated">Down</ion-fab-button>
            <ion-fab-button class="ion-focused">Down</ion-fab-button>
          </ion-fab-list>
        </ion-fab>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe(title('fab: translucent contrast'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-fab-button translucent="true">FAB</ion-fab-button>
        <ion-fab-button class="ion-focused" translucent="true">FAB</ion-fab-button>
        <ion-fab activated="true">
          <ion-fab-button>
            Open
          </ion-fab-button>
          <ion-fab-list side="bottom">
            <ion-fab-button translucent="true">Down</ion-fab-button>
            <ion-fab-button class="ion-focused" translucent="true">Down</ion-fab-button>
          </ion-fab-list>
        </ion-fab>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('fab-button: aria attributes'), () => {
    test('should inherit aria attributes to inner button', async ({ page }) => {
      await page.setContent(
        `
        <ion-fab-button aria-label="Hello World">My Button</ion-fab-button>
      `,
        config
      );

      const nativeButton = page.locator('ion-fab-button button');
      await expect(nativeButton).toHaveAttribute('aria-label', 'Hello World');
    });
  });
});
