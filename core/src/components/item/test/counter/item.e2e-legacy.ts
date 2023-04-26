import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: counter', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/item/test/counter');

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`item-counter-diff-${page.getSnapshotSettings()}.png`);
  });

  test.describe('custom formatter', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/item/test/counter');
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
