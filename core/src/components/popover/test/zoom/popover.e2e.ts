import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: html zoom'), () => {
    test.beforeEach(({ skip }) => {
      /**
       * `zoom` is non-standard CSS and is not supported in Firefox.
       */
      skip.browser('firefox', 'CSS zoom is not supported in Firefox');
    });

    test('should position popover correctly when html is zoomed', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            zoom: 1.5;
          }
        </style>
        <ion-app>
          <ion-content class="ion-padding">
            <ion-button id="trigger">Open</ion-button>
            <ion-popover trigger="trigger" side="bottom" alignment="start">
              <ion-content class="ion-padding">Popover</ion-content>
            </ion-popover>
          </ion-content>
        </ion-app>
        `,
        config
      );

      const trigger = page.locator('#trigger');
      await trigger.click();

      const popover = page.locator('ion-popover');
      const content = popover.locator('.popover-content');

      await expect(content).toBeVisible();
      await content.waitFor({ state: 'visible' });

      const triggerBox = await trigger.boundingBox();
      const contentBox = await content.boundingBox();

      expect(triggerBox).not.toBeNull();
      expect(contentBox).not.toBeNull();

      if (!triggerBox || !contentBox) {
        return;
      }

      expect(Math.abs(contentBox.x - triggerBox.x)).toBeLessThan(2);
      expect(Math.abs(contentBox.y - (triggerBox.y + triggerBox.height))).toBeLessThan(2);
    });

    test('should size cover popover correctly when html is zoomed', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            zoom: 1.5;
          }
        </style>
        <ion-app>
          <ion-content class="ion-padding">
            <ion-button id="trigger">Open</ion-button>
            <ion-popover trigger="trigger" side="bottom" alignment="start" size="cover">
              <ion-content class="ion-padding">Popover</ion-content>
            </ion-popover>
          </ion-content>
        </ion-app>
        `,
        config
      );

      const trigger = page.locator('#trigger');
      await trigger.click();

      const popover = page.locator('ion-popover');
      const content = popover.locator('.popover-content');

      await expect(content).toBeVisible();
      await page.waitForTimeout(350);

      const triggerBox = await trigger.boundingBox();
      const contentBox = await content.boundingBox();

      expect(triggerBox).not.toBeNull();
      expect(contentBox).not.toBeNull();

      if (!triggerBox || !contentBox) {
        return;
      }

      expect(Math.abs(contentBox.width - triggerBox.width)).toBeLessThan(2);
    });
  });
});
