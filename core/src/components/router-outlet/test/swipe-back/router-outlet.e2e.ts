import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * Swipe to go back is only enabled by default in iOS mode,
 * and this behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('router-outlet: swipe back'), () => {
    test('should not block clicks on a non-animated outlet that is moved during a swipe', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-router-outlet animated="false"></ion-router-outlet>
        </ion-app>
      `,
        config
      );

      const outlet = page.locator('ion-router-outlet');

      // A framework normally provides the handler that lets the gesture start.
      await outlet.evaluate((el: HTMLIonRouterOutletElement) => {
        el.swipeHandler = {
          canStart: () => true,
          onStart: () => {},
          onEnd: () => {},
        };
      });
      await page.waitForChanges();

      const box = (await outlet.boundingBox())!;

      await dragElementBy(outlet, page, 60, 0, box.x + 5, box.y + box.height / 2, false);
      await expect(outlet).toHaveCSS('pointer-events', 'none');

      await outlet.evaluate((el) => document.body.appendChild(el));

      await expect(outlet).not.toHaveCSS('pointer-events', 'none');
      await page.mouse.up();
    });
  });
});
