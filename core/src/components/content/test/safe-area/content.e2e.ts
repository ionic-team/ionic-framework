import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * ion-content does not have mode-specific styling
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('content: safe-area'), () => {
    test('should keep the scroll region flush with the viewport when the safe area top changes after load', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31337',
      });

      await page.setContent(
        `
        <style>:root { --ion-safe-area-top: 0px; }</style>
        <ion-app>
          <ion-header>
            <ion-toolbar>
              <ion-title>Header</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content fullscreen>
            <p>Content</p>
          </ion-content>
        </ion-app>
      `,
        config
      );

      const scrollRegion = page.locator('ion-content .inner-scroll');
      const expectFlushWithTop = () =>
        expect(async () => {
          expect(Math.abs((await scrollRegion.boundingBox())!.y)).toBeLessThanOrEqual(1);
        }).toPass({ timeout: 5000 });

      await expectFlushWithTop();

      await page.evaluate(() => document.documentElement.style.setProperty('--ion-safe-area-top', '24px'));

      await expectFlushWithTop();
    });

    test('should keep the scroll region flush with the viewport when the safe area bottom changes after load', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31337',
      });

      await page.setContent(
        `
        <style>:root { --ion-safe-area-bottom: 0px; }</style>
        <ion-app>
          <ion-content fullscreen>
            <p>Content</p>
          </ion-content>

          <ion-footer>
            <ion-toolbar>
              <ion-title>Footer</ion-title>
            </ion-toolbar>
          </ion-footer>
        </ion-app>
      `,
        config
      );

      const scrollRegion = page.locator('ion-content .inner-scroll');
      const viewportHeight = page.viewportSize()!.height;
      const expectFlushWithBottom = () =>
        expect(async () => {
          const box = (await scrollRegion.boundingBox())!;
          expect(Math.abs(box.y + box.height - viewportHeight)).toBeLessThanOrEqual(1);
        }).toPass({ timeout: 5000 });

      await expectFlushWithBottom();

      await page.evaluate(() => document.documentElement.style.setProperty('--ion-safe-area-bottom', '24px'));

      await expectFlushWithBottom();
    });

    test('should recompute the offsets when fullscreen is enabled after load', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-header>
            <ion-toolbar>
              <ion-title>Header</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content>
            <p>Content</p>
          </ion-content>
        </ion-app>
      `,
        config
      );

      const content = page.locator('ion-content');
      const scrollRegion = page.locator('ion-content .inner-scroll');
      const expectFlushWithTop = () =>
        expect(async () => {
          expect(Math.abs((await scrollRegion.boundingBox())!.y)).toBeLessThanOrEqual(1);
        }).toPass({ timeout: 5000 });

      await content.evaluate((el: HTMLIonContentElement) => (el.fullscreen = true));
      await expectFlushWithTop();

      // Only the observer created by the fullscreen watcher can catch this.
      await page.evaluate(() => document.documentElement.style.setProperty('--ion-safe-area-top', '24px'));

      await expectFlushWithTop();
    });

    test('should leave the offsets at zero when fullscreen is disabled after load', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-header>
            <ion-toolbar>
              <ion-title>Header</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content fullscreen>
            <p>Content</p>
          </ion-content>
        </ion-app>
      `,
        config
      );

      const content = page.locator('ion-content');
      const offsetTop = () => content.evaluate((el) => el.style.getPropertyValue('--offset-top'));

      await content.evaluate((el: HTMLIonContentElement) => (el.fullscreen = false));

      await expect(async () => {
        expect(await offsetTop()).toBe('0px');
      }).toPass({ timeout: 5000 });

      await page.evaluate(() => document.documentElement.style.setProperty('--ion-safe-area-top', '24px'));
      await page.waitForTimeout(300);

      expect(await offsetTop()).toBe('0px');
    });

    test('should keep the offsets while the page is hidden', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <div class="ion-page" id="page">
            <ion-header>
              <ion-toolbar>
                <ion-title>Header</ion-title>
              </ion-toolbar>
            </ion-header>

            <ion-content fullscreen>
              <p>Content</p>
            </ion-content>
          </div>
        </ion-app>
      `,
        config
      );

      const content = page.locator('ion-content');
      const scrollRegion = page.locator('ion-content .inner-scroll');
      const offsetTop = () => content.evaluate((el) => el.style.getPropertyValue('--offset-top'));

      await expect(async () => {
        expect(Math.abs((await scrollRegion.boundingBox())!.y)).toBeLessThanOrEqual(1);
      }).toPass({ timeout: 5000 });

      const beforeHiding = await offsetTop();
      expect(beforeHiding).toBe(`${Math.round((await page.locator('ion-header').boundingBox())!.height)}px`);

      await page.evaluate(() => document.getElementById('page')!.classList.add('ion-page-hidden'));
      // Long enough that a missed visibility guard would have committed by now.
      await page.waitForTimeout(300);

      expect(await offsetTop()).toBe(beforeHiding);
    });
  });
});
