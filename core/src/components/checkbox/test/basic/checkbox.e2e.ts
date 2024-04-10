import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: basic visual tests'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <div id="checkboxes">
          <ion-checkbox>Unchecked</ion-checkbox>
          <ion-checkbox checked>Checked</ion-checkbox>
        </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-basic`));
    });

    test('should render custom checkmark-width correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox checked style="--checkmark-width: 7">Checkmark Width</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-checkmark-width`));
    });

    test('should render custom size correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox checked style="--size: 100px">Size</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-size`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: ionChange'), () => {
    test('should fire ionChange when interacting with checkbox', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const checkbox = page.locator('ion-checkbox');

      await checkbox.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: true });

      await checkbox.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: false });
    });

    test('should fire ionChange when interacting with checkbox in item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
        </ion-item>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const item = page.locator('ion-item');

      await item.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: true });

      await item.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: false });
    });

    test('should not fire when programmatically setting a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const checkbox = page.locator('ion-checkbox');

      await checkbox.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
      expect(ionChange).not.toHaveReceivedEvent();
    });

    test('clicking padded space within item should click the checkbox', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-checkbox>Size</ion-checkbox>
        </ion-item>
      `,
        config
      );
      const itemNative = page.locator('.item-native');
      const ionChange = await page.spyOnEvent('ionChange');

      // Clicks the padded space within the item
      await itemNative.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(ionChange).toHaveReceivedEvent();
    });
  });
});

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: basic visual tests'), () => {
    test('should have a small size applied correctly', async ({ page }) => {
      await page.setContent(
        `
        <div id="checkboxes">
          <ion-checkbox size="small">Small</ion-checkbox>
          <ion-checkbox size="small" checked="true">Small - Checked</ion-checkbox>
        </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-small`));
    });
  });

  test.describe(title('checkbox: safe area'), () => {
    test('should click the safe area of a small checkbox', async ({ page }) => {
      await page.setContent(`<ion-checkbox size="small">Small</ion-checkbox>`, config);

      const checkbox = page.locator('ion-checkbox');
      const box = await checkbox.boundingBox();
      if (box !== null) {
        await page.mouse.click(box.x + box.width / 2, box.y + 47);
      }
      await expect(checkbox).toBeFocused();
    });

    test('should click the safe area of a default checkbox', async ({ page }) => {
      await page.setContent(`<ion-checkbox>Default</ion-checkbox>`, config);

      const checkbox = page.locator('ion-checkbox');
      const box = await checkbox.boundingBox();
      if (box !== null) {
        await page.mouse.click(box.x + box.width / 2, box.y + 47);
      }
      await expect(checkbox).toBeFocused();
    });
  });

  test.describe(title('checkbox: shapes'), () => {
    test('should have a soft shape applied correctly', async ({ page }) => {
      await page.setContent(
        `
        <div id="checkboxes">
          <ion-checkbox >soft</ion-checkbox>
          <ion-checkbox shape="soft">Soft</ion-checkbox>
        </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-shape-soft`));
    });

    test('should have a rectangular shape applied correctly', async ({ page }) => {
      await page.setContent(
        `
        <div id="checkboxes">
          <ion-checkbox shape="rectangular">Rectangular</ion-checkbox>
        </div>
      `,
        config
      );

      const checkboxes = page.locator('#checkboxes');
      await expect(checkboxes).toHaveScreenshot(screenshot(`checkbox-shape-rectangular`));
    });
  });
});
