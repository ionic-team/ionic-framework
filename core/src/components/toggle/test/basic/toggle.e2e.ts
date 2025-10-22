import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: ionChange'), () => {
    test('should fire ionChange when interacting with toggle', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle aria-label="toggle" value="my-toggle"></ion-toggle>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const toggle = page.locator('ion-toggle');

      await toggle.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-toggle', checked: true });

      await toggle.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-toggle', checked: false });
    });

    test('should fire ionChange when interacting with toggle in item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-toggle aria-label="toggle" value="my-toggle"></ion-toggle>
        </ion-item>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const item = page.locator('ion-item');

      await item.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-toggle', checked: true });

      await item.click();
      expect(ionChange).toHaveReceivedEventDetail({ value: 'my-toggle', checked: false });
    });

    test('should not fire when programmatically setting a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle aria-label="toggle" value="my-toggle"></ion-toggle>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const toggle = page.locator('ion-toggle');

      await toggle.evaluate((el: HTMLIonToggleElement) => (el.checked = true));
      expect(ionChange).not.toHaveReceivedEvent();
    });
  });

  test.describe(title('toggle: click'), () => {
    test('should trigger onclick only once when clicking the label', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });

      // Create a spy function in page context
      await page.setContent(`<ion-toggle onclick="console.log('click called')">my label</ion-toggle>`, config);

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

  test.describe(title('toggle: ionFocus'), () => {
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
          <ion-toggle>Unchecked</ion-toggle>
        </div>
      `,
        config
      );

      await pageUtils.pressKeys('Tab');

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-focus`));
    });

    test('should not have visual regressions when interacting with toggle in item', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-item class="ion-focused">
          <ion-toggle>Unchecked</ion-toggle>
        </ion-item>
      `,
        config
      );

      // Test focus with keyboard navigation.
      await pageUtils.pressKeys('Tab');

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`toggle-in-item-focus`));
    });

    test('should fire ionFocus when toggle is focused', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-toggle aria-label="toggle" value="my-toggle"></ion-toggle>
      `,
        config
      );

      const ionFocus = await page.spyOnEvent('ionFocus');

      // Test focus with keyboard navigation.
      await pageUtils.pressKeys('Tab');

      expect(ionFocus).toHaveReceivedEventTimes(1);

      // Reset focus.
      const toggle = page.locator('ion-toggle');
      const toggleBoundingBox = (await toggle.boundingBox())!;
      await page.mouse.click(0, toggleBoundingBox.height + 1);

      // Test focus with click.
      await toggle.click();

      expect(ionFocus).toHaveReceivedEventTimes(2);
    });

    test('should fire ionFocus when interacting with toggle in item', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-toggle aria-label="toggle" value="my-toggle"></ion-toggle>
        </ion-item>
      `,
        config
      );

      const ionFocus = await page.spyOnEvent('ionFocus');

      // Test focus with keyboard navigation.
      await pageUtils.pressKeys('Tab');

      expect(ionFocus).toHaveReceivedEventTimes(1);

      // Verify that the event target is the toggle and not the item.
      const eventByKeyboard = ionFocus.events[0];
      expect((eventByKeyboard.target as HTMLElement).tagName.toLowerCase()).toBe('ion-toggle');

      // Reset focus.
      const toggle = page.locator('ion-toggle');
      const toggleBoundingBox = (await toggle.boundingBox())!;
      await page.mouse.click(0, toggleBoundingBox.height + 1);

      // Test focus with click.
      const item = page.locator('ion-item');
      await item.click();

      expect(ionFocus).toHaveReceivedEventTimes(2);

      // Verify that the event target is the toggle and not the item.
      const eventByClick = ionFocus.events[0];
      expect((eventByClick.target as HTMLElement).tagName.toLowerCase()).toBe('ion-toggle');
    });

    test('should not fire when programmatically setting a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle aria-label="toggle" value="my-toggle"></ion-toggle>
      `,
        config
      );

      const ionFocus = await page.spyOnEvent('ionFocus');
      const toggle = page.locator('ion-toggle');

      await toggle.evaluate((el: HTMLIonToggleElement) => (el.checked = true));
      expect(ionFocus).not.toHaveReceivedEvent();
    });
  });
});
