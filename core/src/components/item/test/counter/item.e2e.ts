import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('item: counter', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/item/test/counter', config);

      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`item-counter-diff-${page.getSnapshotSettings()}.png`);
    });

    test.describe('custom formatter', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/src/components/item/test/counter', config);
      });

      test(title('should format on load'), async ({ page }) => {
        const itemCounter = page.locator('#customFormatter .item-counter');

        expect(await itemCounter.textContent()).toBe('20 characters left');
      });

      test(title('should format on input'), async ({ page }) => {
        const input = page.locator('#customFormatter ion-input');

        await input.click();
        await input.type('abcde');

        await page.waitForChanges();

        const itemCounter = page.locator('#customFormatter .item-counter');

        expect(await itemCounter.textContent()).toBe('15 characters left');
      });

      test(title('should format after changing the counterFormatter'), async ({ page }) => {
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
