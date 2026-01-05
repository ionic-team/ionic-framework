import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Tests for keyboard controller memory leak fix when tab-bar
 * is rapidly mounted/unmounted.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tab-bar: lifecycle'), () => {
    test('should not error when rapidly mounting and unmounting', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.setContent(
        `
        <div id="container"></div>
        <script>
          const container = document.getElementById('container');

          for (let i = 0; i < 10; i++) {
            const tabBar = document.createElement('ion-tab-bar');
            tabBar.innerHTML = \`
              <ion-tab-button tab="tab1">
                <ion-label>Tab 1</ion-label>
              </ion-tab-button>
            \`;
            container.appendChild(tabBar);
            container.removeChild(tabBar);
          }
        </script>
        `,
        config
      );

      await page.waitForTimeout(500);

      expect(errors.length).toBe(0);
    });

    test('should cleanup keyboard controller when removed from DOM', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'IONIC-82',
      });

      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.setContent(
        `
        <div id="container">
          <ion-tab-bar id="test-tab-bar">
            <ion-tab-button tab="tab1">
              <ion-label>Tab 1</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </div>
        `,
        config
      );

      const tabBar = page.locator('#test-tab-bar');
      await expect(tabBar).toBeVisible();

      await page.evaluate(() => {
        document.getElementById('test-tab-bar')?.remove();
      });

      await page.waitForTimeout(100);

      await expect(tabBar).not.toBeAttached();
      expect(errors.length).toBe(0);
    });

    test('should handle re-mounting after unmount', async ({ page }) => {
      await page.setContent(
        `
        <div id="container"></div>
        <script>
          const container = document.getElementById('container');

          async function testRemount() {
            const tabBar = document.createElement('ion-tab-bar');
            tabBar.id = 'remount-tab-bar';
            tabBar.innerHTML = \`
              <ion-tab-button tab="tab1">
                <ion-label>Tab 1</ion-label>
              </ion-tab-button>
            \`;
            container.appendChild(tabBar);

            await new Promise(r => setTimeout(r, 100));

            container.removeChild(tabBar);

            await new Promise(r => setTimeout(r, 50));

            container.appendChild(tabBar);
          }

          testRemount();
        </script>
        `,
        config
      );

      await page.waitForTimeout(500);

      const tabBar = page.locator('#remount-tab-bar');
      await expect(tabBar).toBeVisible();
    });
  });
});
