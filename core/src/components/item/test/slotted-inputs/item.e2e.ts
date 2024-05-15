import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: slotted inputs'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/slotted-inputs`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-slotted-inputs`));
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: slotted inputs'), () => {
    test.describe('checkbox', () => {
      test('should not expand the slotted checkbox width larger than its content', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/29423',
        });

        await page.setContent(
          `
          <ion-list>
            <ion-item>
              <ion-checkbox slot="start"></ion-checkbox>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-checkbox slot="end"></ion-checkbox>
            </ion-item>
            <ion-item>
              <ion-checkbox slot="start">Start</ion-checkbox>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-checkbox slot="end">End</ion-checkbox>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`item-slotted-inputs-checkbox`));
      });
    });
    test.describe('radio', () => {
      test('should not expand the slotted radio width larger than its content', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/29423',
        });

        await page.setContent(
          `
          <ion-list>
            <ion-item>
              <ion-radio slot="start"></ion-radio>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-radio slot="end"></ion-radio>
            </ion-item>
            <ion-item>
              <ion-radio slot="start">Start</ion-radio>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-radio slot="end">End</ion-radio>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`item-slotted-inputs-radio`));
      });
    });
    test.describe('select', () => {
      test('should not expand the slotted select width larger than its content', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/29423',
        });

        await page.setContent(
          `
          <ion-list>
            <ion-item>
              <ion-select slot="start">
                <ion-select-option>Option</ion-select-option>
              </ion-select>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-select slot="end">
                <ion-select-option>Option</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-select slot="start" label="Start">
                <ion-select-option>Option</ion-select-option>
              </ion-select>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-select slot="end" label="End">
                <ion-select-option>Option</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`item-slotted-inputs-select`));
      });
    });
    test.describe('toggle', () => {
      test('should not expand the slotted toggle width larger than its content', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/29423',
        });

        await page.setContent(
          `
          <ion-list>
            <ion-item>
              <ion-toggle slot="start"></ion-toggle>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-toggle slot="end"></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-toggle slot="start">Start</ion-toggle>
              <ion-label>Label</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Label</ion-label>
              <ion-toggle slot="end">End</ion-toggle>
            </ion-item>
          </ion-list>
        `,
          config
        );

        const list = page.locator('ion-list');

        await expect(list).toHaveScreenshot(screenshot(`item-slotted-inputs-toggle`));
      });
    });
  });
});
