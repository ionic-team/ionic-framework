import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('counter: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/item/test/counter', config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-counter-diff`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('item: counter'), () => {
    test.describe('custom formatter', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/src/components/item/test/counter', config);
      });

      test('should format on load', async ({ page }) => {
        const itemCounter = page.locator('#customFormatter .item-counter');

        expect(await itemCounter.textContent()).toBe('20 characters left');
      });

      test('should format on input', async ({ page }) => {
        const input = page.locator('#customFormatter ion-input');

        await page.click('#customFormatter ion-input input');
        await input.type('abcde');

        await page.waitForChanges();

        const itemCounter = page.locator('#customFormatter .item-counter');

        expect(await itemCounter.textContent()).toBe('15 characters left');
      });

      test('should format after changing the counterFormatter', async ({ page }) => {
        const itemCounter = page.locator('#customFormatter .item-counter');

        expect(await itemCounter.textContent()).toBe('20 characters left');

        await page.$eval('#customFormatter', (el: any) => {
          el.counterFormatter = () => {
            return 'test label';
          };
        });
        await page.waitForChanges();

        expect(await itemCounter.textContent()).toBe('test label');
      });
    });
  });
});
