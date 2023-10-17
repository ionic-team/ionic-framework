import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('split-pane: multiple'), () => {
    test('using multiple split panes should not hide a menu in another split pane', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18683',
      });

      await page.setViewportSize(Viewports.large);
      await page.goto(`/src/components/split-pane/test/multiple`, config);

      const menuOne = page.locator('ion-menu#menu-one');
      const menuTwo = page.locator('ion-menu#menu-two');

      const showPaneOne = page.locator('button#show-pane-one');
      const showPaneTwo = page.locator('button#show-pane-two');

      await expect(menuOne).toBeVisible();

      await showPaneTwo.click();

      await expect(menuTwo).toBeVisible();

      await showPaneOne.click();

      await expect(menuOne).toBeVisible();
    });
  });
});
