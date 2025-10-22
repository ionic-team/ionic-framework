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

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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

  test.describe(title('checkbox: ionFocus'), () => {
    test('should not have visual regressions', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <style>
          #container {
            display: inline-block;
            padding: 10px;
          }
        </style>

        <div id="container">
          <ion-checkbox>Unchecked</ion-checkbox>
        </div>
      `,
        config
      );

      await pageUtils.pressKeys('Tab');

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`checkbox-focus`));
    });

    test('should not have visual regressions when interacting with checkbox in item', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-item class="ion-focused">
          <ion-checkbox>Unchecked</ion-checkbox>
        </ion-item>
      `,
        config
      );

      // Test focus with keyboard navigation.
      await pageUtils.pressKeys('Tab');

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`checkbox-in-item-focus`));
    });

    test('should fire ionFocus when checkbox is focused', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionFocus = await page.spyOnEvent('ionFocus');

      // Test focus with keyboard navigation.
      await pageUtils.pressKeys('Tab');

      expect(ionFocus).toHaveReceivedEventTimes(1);

      // Reset focus.
      const checkbox = page.locator('ion-checkbox');
      const checkboxBoundingBox = (await checkbox.boundingBox())!;
      await page.mouse.click(0, checkboxBoundingBox.height + 1);

      // Test focus with click.
      await checkbox.click();

      expect(ionFocus).toHaveReceivedEventTimes(2);
    });

    test('should fire ionFocus when interacting with checkbox in item', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
        </ion-item>
      `,
        config
      );

      const ionFocus = await page.spyOnEvent('ionFocus');

      // Test focus with keyboard navigation.
      await pageUtils.pressKeys('Tab');

      expect(ionFocus).toHaveReceivedEventTimes(1);

      // Verify that the event target is the checkbox and not the item.
      const eventByKeyboard = ionFocus.events[0];
      expect((eventByKeyboard.target as HTMLElement).tagName.toLowerCase()).toBe('ion-checkbox');

      // Reset focus.
      const checkbox = page.locator('ion-checkbox');
      const checkboxBoundingBox = (await checkbox.boundingBox())!;
      await page.mouse.click(0, checkboxBoundingBox.height + 1);

      // Test focus with click.
      const item = page.locator('ion-item');
      await item.click();

      expect(ionFocus).toHaveReceivedEventTimes(2);

      // Verify that the event target is the checkbox and not the item.
      const eventByClick = ionFocus.events[0];
      expect((eventByClick.target as HTMLElement).tagName.toLowerCase()).toBe('ion-checkbox');
    });

    test('should not fire when programmatically setting a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionFocus = await page.spyOnEvent('ionFocus');
      const checkbox = page.locator('ion-checkbox');

      await checkbox.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
      expect(ionFocus).not.toHaveReceivedEvent();
    });
  });

  test.describe(title('checkbox: ionBlur'), () => {
    test('should fire ionBlur when checkbox is blurred', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionBlur = await page.spyOnEvent('ionBlur');

      // Test blur with keyboard navigation.
      // Focus the checkbox.
      await pageUtils.pressKeys('Tab');
      // Blur the checkbox.
      await pageUtils.pressKeys('Tab');

      expect(ionBlur).toHaveReceivedEventTimes(1);

      // Test blur with click.
      const checkbox = page.locator('ion-checkbox');
      // Focus the checkbox.
      await checkbox.click();
      // Blur the checkbox by clicking outside of it.
      const checkboxBoundingBox = (await checkbox.boundingBox())!;
      await page.mouse.click(0, checkboxBoundingBox.height + 1);

      expect(ionBlur).toHaveReceivedEventTimes(2);
    });

    test('should fire ionBlur after interacting with checkbox in item', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-checkbox aria-label="checkbox" value="my-checkbox"></ion-checkbox>
        </ion-item>
      `,
        config
      );

      const ionBlur = await page.spyOnEvent('ionBlur');

      // Test blur with keyboard navigation.
      // Focus the checkbox.
      await pageUtils.pressKeys('Tab');
      // Blur the checkbox.
      await pageUtils.pressKeys('Tab');

      expect(ionBlur).toHaveReceivedEventTimes(1);

      // Verify that the event target is the checkbox and not the item.
      const event = ionBlur.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-checkbox');

      // Test blur with click.
      const item = page.locator('ion-item');
      await item.click();
      // Blur the checkbox by clicking outside of it.
      const itemBoundingBox = (await item.boundingBox())!;
      await page.mouse.click(0, itemBoundingBox.height + 1);

      expect(ionBlur).toHaveReceivedEventTimes(2);

      // Verify that the event target is the checkbox and not the item.
      const eventByClick = ionBlur.events[0];
      expect((eventByClick.target as HTMLElement).tagName.toLowerCase()).toBe('ion-checkbox');
    });
  });
});
