import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('split-pane: functionality'), () => {
    test('should be visible on larger viewports', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/16304',
      });

      await page.setViewportSize(Viewports.large);
      await page.goto(`/src/components/split-pane/test/wrapped-menu`, config);

      const menu = page.locator('ion-menu');
      await expect(menu).toBeVisible();
    });
  });
});
