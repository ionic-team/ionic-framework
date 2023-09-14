import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('menu: safe area'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu/test/safe-area`, config);
    });
    test.describe('side: start', () => {
      test('should render with safe area when notch is on the left', async ({ page }) => {
        const ionDidOpen = await page.spyOnEvent('ionDidOpen');
        const ionDidClose = await page.spyOnEvent('ionDidClose');

        await page.evaluate(() => {
          const style = document.createElement('style');
          style.innerHTML = `
            :root {
              --ion-safe-area-left: 50px;
              --ion-safe-area-right: 10px;
            }
          `;
          document.head.appendChild(style);
        });

        await page.click('#open-start');
        await ionDidOpen.next();

        await expect(page).toHaveScreenshot(screenshot(`menu-start-safe-area-left-notch`));

        await page.locator('[menu-id="start-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
          await el.close();
        });
        await ionDidClose.next();
      });
      test('should render with safe area when notch is on the right', async ({ page }) => {
        const ionDidOpen = await page.spyOnEvent('ionDidOpen');
        const ionDidClose = await page.spyOnEvent('ionDidClose');

        await page.evaluate(() => {
          const style = document.createElement('style');
          style.innerHTML = `
            :root {
              --ion-safe-area-left: 10px;
              --ion-safe-area-right: 50px;
            }
          `;
          document.head.appendChild(style);
        });

        await page.click('#open-start');
        await ionDidOpen.next();

        await expect(page).toHaveScreenshot(screenshot(`menu-start-safe-area-right-notch`));

        await page.locator('[menu-id="start-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
          await el.close();
        });
        await ionDidClose.next();
      });
    });
    test.describe('side: end', () => {
      test('should render with safe area when notch is on the left', async ({ page }) => {
        const ionDidOpen = await page.spyOnEvent('ionDidOpen');
        const ionDidClose = await page.spyOnEvent('ionDidClose');

        await page.evaluate(() => {
          const style = document.createElement('style');
          style.innerHTML = `
            :root {
              --ion-safe-area-left: 50px;
              --ion-safe-area-right: 10px;
            }
          `;
          document.head.appendChild(style);
        });

        await page.click('#open-end');
        await ionDidOpen.next();

        await expect(page).toHaveScreenshot(screenshot(`menu-end-safe-area-left-notch`));

        await page.locator('[menu-id="end-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
          await el.close();
        });
        await ionDidClose.next();
      });
      test('should render with safe area when notch is on the right', async ({ page }) => {
        const ionDidOpen = await page.spyOnEvent('ionDidOpen');
        const ionDidClose = await page.spyOnEvent('ionDidClose');

        await page.evaluate(() => {
          const style = document.createElement('style');
          style.innerHTML = `
            :root {
              --ion-safe-area-left: 10px;
              --ion-safe-area-right: 50px;
            }
          `;
          document.head.appendChild(style);
        });

        await page.click('#open-end');
        await ionDidOpen.next();

        await expect(page).toHaveScreenshot(screenshot(`menu-end-safe-area-right-notch`));

        await page.locator('[menu-id="end-menu"]').evaluate(async (el: HTMLIonMenuElement) => {
          await el.close();
        });
        await ionDidClose.next();
      });
    });
  });
});
