import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: counter', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/item/test/counter');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-counter-diff-${page.getSnapshotSettings()}.png`);
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

      await input.click();
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

    test.describe('when an exception occurs', () => {
      const logs: string[] = [];

      test.beforeEach(async ({ page }) => {
        await page.setContent(`
          <ion-item counter="true"">
            <ion-input maxlength="20" value=""></ion-input>
          </ion-item>`);

        page.on('console', (ev) => {
          if (ev.type() === 'error') {
            logs.push(ev.text());
          }
        });

        const itemCounter = page.locator('ion-item .item-counter');

        expect(await itemCounter.textContent()).toBe('0 / 20');

        await page.$eval('ion-item', (el: any) => {
          el.counterFormatter = () => {
            throw new Error('This is an expected error');
          };
        });
        await page.waitForChanges();
      });

      test('should default the formatting to length / maxlength', async ({ page }) => {
        const input = page.locator('ion-input');

        await input.click();
        await input.type('abcde');

        const itemCounter = page.locator('ion-item .item-counter');

        expect(await itemCounter.textContent()).toBe('5 / 20');
      });

      test('should log an error', () => {
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0]).toMatch('[Ionic Error]: Exception in provided `counterFormatter`.');
      });
    });
  });
});
