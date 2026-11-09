import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: in item'), () => {
    test('should render correctly in an item', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29033',
      });
      await page.setContent(
        `
        <ion-item>
          <ion-label slot="start">Start</ion-label>
          <ion-label>Default</ion-label>
          <ion-label slot="end">End</ion-label>
        </ion-item>
        `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`label-item`));
    });

    test('should render a dimmed label in an item with a disabled input', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label>Label</ion-label>
          <ion-select aria-label="Fruit" placeholder="Select fruit" disabled>
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        </ion-item>
        `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveClass(/item-interactive-disabled/);
      await expect(item).toHaveScreenshot(screenshot(`label-item-disabled`));
    });
  });
});

/**
 * Only md changes the color of a stacked or floating
 * label when its item is focused.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: in focused item'), () => {
    test('should keep the label color when set in a focused item', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item button="true" class="ion-focused">
            <ion-label position="stacked">Default</ion-label>
          </ion-item>
          <ion-item button="true" class="ion-focused">
            <ion-label position="stacked" color="danger">Danger</ion-label>
          </ion-item>
        </ion-list>
        `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`label-item-focused-color`));
    });
  });
});
