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
 * iOS does not change the color of a stacked or floating
 * label when its item is focused. It is included to verify
 * that the label keeps its default color.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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

/**
 * The ios, md and ionic themes each float the label
 * with their own item styles, so this runs in all three.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: floating in item with value'), () => {
    test('should float the label when the item has a value', async ({ page }) => {
      /**
       * The Angular value accessor adds `item-has-value`
       * to the item when its input has a value.
       */
      await page.setContent(
        `
          <ion-item class="item-has-value">
            <ion-label position="floating">Floating</ion-label>
          </ion-item>
          `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`label-item-floating-has-value`));
    });
  });
});

/**
 * iOS does not float the label when its item is focused.
 */
configs({ modes: ['md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: floating in focused item'), () => {
    test('should float the label when the item is focused', async ({ page }) => {
      await page.setContent(
        `
        <ion-item button="true" class="ion-focused">
          <ion-label position="floating">Floating</ion-label>
        </ion-item>
        `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`label-item-floating-focused`));
    });
  });
});

/**
 * iOS stacked labels are not scaled, so their transform origin
 * does not change their position.
 */
configs({ modes: ['md', 'ionic-md'], directions: ['rtl'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: stacked in ltr section of rtl document'), () => {
    test('should scale the label from the start of the ltr section', async ({ page }) => {
      /**
       * The label should follow the direction of the nearest ancestor
       * with a `dir` attribute, so it sits at the left edge of the item
       * even though the document is RTL.
       */
      await page.setContent(
        `
        <div dir="ltr">
          <ion-item>
            <ion-label position="stacked">Stacked</ion-label>
          </ion-item>
        </div>
        `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`label-item-stacked-ltr-in-rtl`));
    });
  });
});
