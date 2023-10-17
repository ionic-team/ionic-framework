import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('split-pane: multiple'), () => {
    test('using multiple split panes should not hide a menu in another split pane', async ({ page }) => {
      await page.setViewportSize(Viewports.large);
      await page.goto(`/src/components/split-pane/test/multiple`, config);

      const menuOne = page.locator('ion-menu#menu-one');
      const menuTwo = page.locator('ion-menu#menu-two');

      await expect(menuOne).toBeVisible();
    });
  });
});
