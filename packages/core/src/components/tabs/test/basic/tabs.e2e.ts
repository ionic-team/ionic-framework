import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tabs: basic'), () => {
    test('should show correct tab when clicking the tab button', async ({ page }) => {
      await page.goto('/src/components/tabs/test/basic', config);

      const tabOne = page.locator('ion-tab[tab="tab-one"]');
      const tabTwo = page.locator('ion-tab[tab="schedule"]');

      // The tab button for tab 3 is disabled so this is never visible
      const tabThree = page.locator('ion-tab[tab="tab-three"]');

      // Tab Four renders a nested web component
      const tabFour = page.locator('ion-tab[tab="tab-four"] page-one');

      await expect(tabOne).toBeVisible();
      await expect(tabTwo).toBeHidden();
      await expect(tabThree).toBeHidden();
      await expect(tabFour).toBeHidden();

      await page.click('ion-tab-button[tab="schedule"]');

      await expect(tabOne).toBeHidden();
      await expect(tabTwo).toBeVisible();
      await expect(tabThree).toBeHidden();
      await expect(tabFour).toBeHidden();

      await page.click('ion-tab-button[tab="tab-four"]');

      await expect(tabOne).toBeHidden();
      await expect(tabTwo).toBeHidden();
      await expect(tabThree).toBeHidden();
      await expect(tabFour).toBeVisible();
    });
  });
});
