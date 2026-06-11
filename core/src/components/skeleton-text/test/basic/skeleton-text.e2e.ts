import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('skeleton-text: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <style>
            #container {
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding: 8px;
            }

            .line {
              width: 60%;
            }

            #circle {
              border-radius: 50%;

              width: 50px;
              height: 50px;
            }
          </style>

          <div id="container">
            <ion-skeleton-text class="line"></ion-skeleton-text>

            <div id="circle">
              <ion-skeleton-text></ion-skeleton-text>
            </div>

            <ion-avatar>
              <ion-skeleton-text></ion-skeleton-text>
            </ion-avatar>

            <ion-thumbnail>
              <ion-skeleton-text></ion-skeleton-text>
            </ion-thumbnail>

            <ion-label>
              <ion-skeleton-text class="line"></ion-skeleton-text>
            </ion-label>
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('skeleton-text-basic'));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('skeleton-text: border radius'), () => {
    test('should match the border radius of its containing element', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-thumbnail {
              --ion-thumbnail-border-radius: 10px;
            }

            ion-avatar {
              --border-radius: 12px;
            }

            #box {
              border-radius: 8px;

              width: 48px;
              height: 48px;
            }
          </style>

          <ion-thumbnail>
            <ion-skeleton-text></ion-skeleton-text>
          </ion-thumbnail>

          <ion-avatar>
            <ion-skeleton-text></ion-skeleton-text>
          </ion-avatar>

          <div id="box">
            <ion-skeleton-text></ion-skeleton-text>
          </div>
        `,
        config
      );

      const thumbnailSkeleton = page.locator('ion-thumbnail ion-skeleton-text');
      const avatarSkeleton = page.locator('ion-avatar ion-skeleton-text');
      const boxSkeleton = page.locator('#box ion-skeleton-text');

      await expect(thumbnailSkeleton).toHaveCSS('border-top-left-radius', '10px');
      await expect(avatarSkeleton).toHaveCSS('border-top-left-radius', '12px');
      await expect(boxSkeleton).toHaveCSS('border-top-left-radius', '8px');
    });
  });

  test.describe(title('skeleton-text: basic'), () => {
    // The ionStyle event is emitted once on load so a parent (e.g. ion-item)
    // can react to the skeleton.
    test('should emit ionStyle on load', async ({ page }) => {
      await page.setContent('', config);

      const ionStyle = await page.spyOnEvent('ionStyle');

      await page.evaluate(() => {
        const skeleton = document.createElement('ion-skeleton-text');
        document.body.appendChild(skeleton);
      });

      await ionStyle.next();

      expect(ionStyle).toHaveReceivedEventDetail({ 'skeleton-text': true });
    });
  });
});
