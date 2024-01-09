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

    test('should be visible on larger viewports when added async', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/16304',
      });

      await page.setViewportSize(Viewports.large);
      await page.goto(`/src/components/split-pane/test/wrapped-menu`, config);

      // Asynchronously add a second menu
      await page.evaluate(() => {
        const menu = document.createElement('app-menu');
        menu.setAttribute('side', 'end');
        const splitPane = document.querySelector('ion-split-pane')!;
        splitPane.appendChild(menu);
      });

      const menus = page.locator('ion-menu');
      const menuButton = page.locator('ion-menu-button');

      await expect(menus).toHaveCount(2);
      await expect(menus.nth(0)).toBeVisible();
      await expect(menus.nth(1)).toBeVisible();

      // Menu button should be hidden because menus are visible
      await expect(menuButton).toBeHidden();
    });
  });
});
