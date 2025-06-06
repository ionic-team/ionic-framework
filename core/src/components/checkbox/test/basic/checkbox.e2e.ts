import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
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
  });

  test.describe(title('checkbox: click'), () => {
    test('should trigger onclick only once when clicking the label', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });

      // Create a spy function in page context
      await page.setContent(`<ion-checkbox onclick="console.log('click called')">Test Checkbox</ion-checkbox>`, config);

      // Track calls to the exposed function
      let clickCount = 0;
      page.on('console', (msg) => {
        if (msg.text().includes('click called')) {
          clickCount++;
        }
      });

      const input = page.locator('div.label-text-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await input.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickCount).toBe(1);
    });
  });
});
