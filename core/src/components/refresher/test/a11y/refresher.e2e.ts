import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md'], themes: ['light', 'dark'] }).forEach(({ config, title }) => {
  test.describe(title('refresher: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-content>
          <ion-refresher class="refresher-native" slot="fixed">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
        </ion-content>
      `,
        config
      );

      const target = page.locator('body');
      const refresher = await page.locator('ion-refresher');

      await dragElementBy(target, page, 0, 320, undefined, undefined, false);

      await expect(refresher).toHaveClass(/refresher-pulling/);

      /**
       * The Axe test fails because a landmark role like `<main>` is missing from the top level.
       *
       * It also fails when adding a `<main>` element because
       * the `<ion-content>` component already has a `<main>` element.
       * This leads to a nested `<main>` element which is not allowed.
       */
      const results = await new AxeBuilder({ page }).disableRules('region').analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
