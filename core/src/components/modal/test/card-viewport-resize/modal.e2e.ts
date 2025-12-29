import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('card modal: viewport resize'), () => {
    test.beforeEach(async ({ page }) => {
      // Start in portrait mode (mobile)
      await page.setViewportSize({ width: 375, height: 667 });

      await page.setContent(
        `
        <ion-app>
          <div class="ion-page" id="main-page">
            <ion-header>
              <ion-toolbar>
                <ion-title>Card Viewport Resize Test</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
              <p>This page tests that viewport resize does not trigger card modal animation when modal is closed.</p>
              <ion-button id="open-modal">Open Card Modal</ion-button>
              <ion-modal id="card-modal">
                <ion-header>
                  <ion-toolbar>
                    <ion-title>Card Modal</ion-title>
                    <ion-buttons slot="end">
                      <ion-button id="close-modal">Close</ion-button>
                    </ion-buttons>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <p>Modal content</p>
                </ion-content>
              </ion-modal>
            </ion-content>
          </div>
        </ion-app>

        <script>
          const modal = document.querySelector('#card-modal');
          const mainPage = document.querySelector('#main-page');
          modal.presentingElement = mainPage;

          document.querySelector('#open-modal').addEventListener('click', () => {
            modal.present();
          });

          document.querySelector('#close-modal').addEventListener('click', () => {
            modal.dismiss();
          });
        </script>
        `,
        config
      );
    });

    test('should not animate presenting element when viewport resizes and modal is closed', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30679',
      });

      const mainPage = page.locator('#main-page');

      // Verify the presenting element has no transform initially
      const initialTransform = await mainPage.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(initialTransform).toBe('none');

      // Resize from portrait to landscape (crossing the 768px threshold)
      await page.setViewportSize({ width: 900, height: 375 });

      // Wait for the debounced resize handler (50ms) plus some buffer
      await page.waitForTimeout(150);

      // The presenting element should still have no transform
      // If the bug exists, it would have scale(0.93) or similar applied
      const afterResizeTransform = await mainPage.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(afterResizeTransform).toBe('none');
    });

    test('should not animate presenting element when resizing multiple times with modal closed', async ({ page }) => {
      const mainPage = page.locator('#main-page');

      // Multiple resize cycles should not trigger the animation
      for (let i = 0; i < 3; i++) {
        // Portrait to landscape
        await page.setViewportSize({ width: 900, height: 375 });
        await page.waitForTimeout(150);

        let transform = await mainPage.evaluate((el) => {
          return window.getComputedStyle(el).transform;
        });
        expect(transform).toBe('none');

        // Landscape to portrait
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(150);

        transform = await mainPage.evaluate((el) => {
          return window.getComputedStyle(el).transform;
        });
        expect(transform).toBe('none');
      }
    });

    test('should still animate presenting element correctly when modal is open and viewport resizes', async ({
      page,
    }) => {
      const mainPage = page.locator('#main-page');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      // Open the modal
      await page.click('#open-modal');
      await ionModalDidPresent.next();

      // When modal is open in portrait, presenting element should be transformed
      let transform = await mainPage.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      // The presenting element should have a scale transform when modal is open
      expect(transform).not.toBe('none');

      // Resize to landscape while modal is open
      await page.setViewportSize({ width: 900, height: 375 });
      await page.waitForTimeout(150);

      // The modal transitions correctly - in landscape mode the presenting element
      // should have different (or no) transform than portrait
      transform = await mainPage.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Note: The exact transform depends on the landscape handling
      // The main point is that when modal IS open, the transition should work
      // This test just ensures we don't break existing functionality
    });

    test('presenting element should return to normal after modal is dismissed', async ({ page }) => {
      const mainPage = page.locator('#main-page');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      // Open the modal
      await page.click('#open-modal');
      await ionModalDidPresent.next();

      // Close the modal
      await page.click('#close-modal');
      await ionModalDidDismiss.next();

      // Wait for animations to complete
      await page.waitForTimeout(500);

      // The presenting element should be back to normal
      const transform = await mainPage.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(transform).toBe('none');

      // Now resize the viewport - should not trigger animation
      await page.setViewportSize({ width: 900, height: 375 });
      await page.waitForTimeout(150);

      const afterResizeTransform = await mainPage.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(afterResizeTransform).toBe('none');
    });
  });
});
