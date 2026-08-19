import { expect } from '@playwright/test';
import { configs, dragElementByYAxis, test } from '@utils/test/playwright';

/**
 * Rendering puts `slot="fixed"` on the host, so a refresher whose markup omits the
 * slot still ends up in the right place and has to work. Frameworks that assign the
 * slot after inserting the element start out the same way.
 *
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('refresher: missing slot'), () => {
    test('should still set up the pull-to-refresh gesture', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31376',
      });

      await page.setContent(
        `
        <ion-content>
          <ion-refresher>
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>

          <div style="height: 200vh"></div>
        </ion-content>
      `,
        config
      );
      /**
       * Gesture setup runs behind a dynamic import, so dragging straight after
       * setContent can land before the refresher is listening.
       */
      await page.locator('ion-refresher.hydrated').waitFor({ state: 'attached' });

      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await dragElementByYAxis(page.locator('body'), page, 320);

      await expect.poll(() => ionRefresh.events.length).toBe(1);
    });

    test('should report an error telling the developer to add the slot', async ({ page }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      });

      await page.setContent(
        `
        <ion-content>
          <ion-refresher>
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
        </ion-content>
      `,
        config
      );
      await page.locator('ion-refresher.hydrated').waitFor({ state: 'attached' });

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain('[Ionic Error]: [ion-refresher] - Make sure you use: <ion-refresher slot="fixed">');
    });
  });
});
