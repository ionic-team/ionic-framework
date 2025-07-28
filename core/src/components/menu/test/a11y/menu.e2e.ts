import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: a11y'), () => {
    test('menu should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/menu/test/a11y`, config);

      const menu = page.locator('ion-menu');
      const button = page.locator('#open-menu');

      await button.click();
      await expect(menu).toBeVisible();

      await expect(menu).toHaveAttribute('role', 'navigation');

      const heading = page.locator('ion-menu h1');
      await expect(heading).toHaveText('Open Menu');

      /**
       * Skip the rule that checks if the menu is scrollable and focusable.
       * This test is missing the `ion-app` wrapper which allows the
       * menu content to be focusable.
       */
      const results = await new AxeBuilder({ page }).disableRules('scrollable-region-focusable').analyze();
      expect(results.violations).toEqual([]);
    });
  });
});
