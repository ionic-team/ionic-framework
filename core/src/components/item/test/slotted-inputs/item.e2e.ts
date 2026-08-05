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

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('item: focus indicator room'), () => {
    test('should reserve room for a control added inside a slotted wrapper', async ({ page }) => {
      // A control can appear inside an already slotted wrapper after the item renders,
      // and the item still has to make room for its focus indicator.
      await page.setContent(
        `
        <ion-item button>
          <div id="wrapper"></div>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).not.toHaveClass(/item-focus-indicator-room/);

      await page.evaluate(() => {
        document.querySelector('#wrapper')!.appendChild(document.createElement('ion-toggle'));
      });

      await expect(item).toHaveClass(/item-focus-indicator-room/);

      await page.evaluate(() => {
        document.querySelector('ion-toggle')!.remove();
      });

      await expect(item).not.toHaveClass(/item-focus-indicator-room/);
    });

    test('should mark the item multi-input when a control is added inside a slotted wrapper', async ({ page }) => {
      // Whether a control draws its own indicator depends on this class, so it has to
      // track the same mutations the room does.
      await page.setContent(
        `
        <ion-item>
          <ion-checkbox>One</ion-checkbox>
          <div id="wrapper"></div>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).not.toHaveClass(/item-multiple-inputs/);

      await page.evaluate(() => {
        document.querySelector('#wrapper')!.appendChild(document.createElement('ion-checkbox'));
      });

      await expect(item).toHaveClass(/item-multiple-inputs/);
      await expect(item).toHaveClass(/item-focus-indicator-room/);
    });
  });
});
