import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const waitForApp = async (app: Locator) => {
  await expect
    .poll(() =>
      app.evaluate(async (el: HTMLIonAppElement) => {
        const button = el.querySelector<HTMLElement>('.ion-focusable')!;
        await el.setFocus([button]);
        return button.classList.contains('ion-focused');
      })
    )
    .toBe(true);
};

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('app: remounting'), () => {
    test.beforeEach(async ({ page }) => {
      // Tap effects are intentionally disabled by the normal testing config.
      await page.goto('/src/components/app/test/remount?ionic:_testing=false', config);
      await waitForApp(page.locator('ion-app'));
    });

    test('should add one ripple after repeated remounts', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => (window as any).remount());
        await waitForApp(page.locator('ion-app'));
      }
      await page.locator('.ion-activatable').hover();
      await page.mouse.down();
      await expect(page.locator('ion-ripple-effect .ripple-effect')).toHaveCount(1);
      await page.mouse.up();
    });

    test('should dispatch one back-button event after repeated remounts', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => (window as any).remount());
        await waitForApp(page.locator('ion-app'));
      }
      const events = await page.evaluate(() => {
        let count = 0;
        document.addEventListener('ionBackButton', () => count++);
        document.dispatchEvent(new Event('backbutton'));
        return count;
      });
      expect(events).toBe(1);
    });

    test('should keep helpers usable when apps are replaced in quick succession', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).remount();
        (window as any).remount();
      });
      await waitForApp(page.locator('ion-app'));
      const events = await page.evaluate(() => {
        let count = 0;
        document.addEventListener('ionBackButton', () => count++);
        document.dispatchEvent(new Event('backbutton'));
        return count;
      });
      expect(events).toBe(1);
    });

    test('should share in-flight initialization and preserve setFocus on each app', async ({ page }) => {
      await page.goto('/src/components/app/test/remount?ionic:_testing=false&multiple=true', config);
      await waitForApp(page.locator('ion-app').first());
      await waitForApp(page.locator('ion-app').last());
      const events = await page.evaluate(() => {
        let count = 0;
        document.addEventListener('ionBackButton', () => count++);
        document.dispatchEvent(new Event('backbutton'));
        return count;
      });
      expect(events).toBe(1);
    });

    test('should preserve the disabled hardware-back-button configuration', async ({ page }) => {
      await page.goto('/src/components/app/test/remount?ionic:_testing=false&hardwareBackButton=false', config);
      await waitForApp(page.locator('ion-app'));
      await page.evaluate(() => (window as any).remount());
      await waitForApp(page.locator('ion-app'));
      const events = await page.evaluate(() => {
        let count = 0;
        document.addEventListener('ionBackButton', () => count++);
        document.dispatchEvent(new Event('backbutton'));
        return count;
      });
      expect(events).toBe(0);
    });
  });
});
