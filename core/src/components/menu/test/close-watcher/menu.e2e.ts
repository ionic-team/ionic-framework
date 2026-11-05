import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: close watcher'), () => {
    test('should close the menu on a close request and release the back button', async ({ page, skip }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29648',
      });
      skip.browser((browserName: string) => browserName !== 'chromium', 'Only Chromium supports the CloseWatcher API');

      await page.setContent(
        `
        <script>
          window.Ionic.config.experimentalCloseWatcher = true;

          // Count live watchers so the test can check the back button gets released
          window.liveCloseWatchers = 0;
          const NativeCloseWatcher = window.CloseWatcher;
          window.CloseWatcher = class extends NativeCloseWatcher {
            constructor(...args) {
              super(...args);
              window.liveCloseWatchers++;
              this.addEventListener('close', () => this.release());
            }
            destroy() {
              this.release();
              super.destroy();
            }
            // A closed watcher can still be destroyed, so only count it once
            release() {
              if (!this.released) {
                this.released = true;
                window.liveCloseWatchers--;
              }
            }
          };
        </script>
        <ion-app>
          <ion-menu content-id="main">
            <ion-content>Menu Content</ion-content>
          </ion-menu>
          <div class="ion-page" id="main">
            <ion-content>Main Content</ion-content>
          </div>
        </ion-app>
      `,
        config
      );

      const menu = page.locator('ion-menu');
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await ionDidOpen.next();
      expect(await page.evaluate(() => (window as any).liveCloseWatchers)).toBe(1);

      // Escape sends a close request to the active CloseWatcher
      await page.keyboard.press('Escape');

      await ionDidClose.next();
      await expect(menu).not.toHaveClass(/show-menu/);
      expect(await page.evaluate(() => (window as any).liveCloseWatchers)).toBe(0);
    });
  });
});
