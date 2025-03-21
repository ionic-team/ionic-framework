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
          <ion-avatar id="avatar-characters-disabled" disabled> AV </ion-avatar>
          <ion-avatar id="avatar-characters-disabled" disabled>
            <img src="/src/components/avatar/test/avatar.svg" />
          </ion-avatar>
        </div> 
      `,
        config
      );
      const avatarCharactersDisabled = page.locator('#avatar-characters-disabled');
      const avatarDisabled = page.locator('#avatar-disabled');
      await expect(avatarCharactersDisabled).toHaveScreenshot(screenshot(`avatar-characters-disabled-diff`));
      await expect(avatarDisabled).toHaveScreenshot(screenshot(`avatar-disabled-diff`));
    });
  });
});
