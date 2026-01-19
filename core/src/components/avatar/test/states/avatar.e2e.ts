import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Avatar does not test RTL behaviors.
 * Usages of Avatar in slots are tested in components that use Avatar.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: states'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        ` 
        <div id="container"> 
          <ion-avatar disabled> AV </ion-avatar>
          <ion-avatar disabled>
            <ion-icon name="person-outline"></ion-icon>
          </ion-avatar>
          <ion-avatar disabled>
            <img src="/src/components/avatar/test/avatar.svg" />
          </ion-avatar>
        </div> 
      `,
        config
      );
      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`avatar-disabled`));
    });
  });
});
