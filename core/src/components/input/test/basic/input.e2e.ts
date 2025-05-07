import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: basic'), () => {
    test.describe('input with overflow', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input aria-label="Long Input" value="reallylonglonglonginputtoseetheedgesreallylonglonglonginputtoseetheedges"></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input where text extends off the edge of the component.
        await expect(input).toHaveScreenshot(screenshot(`input-with-text-overflow`));
      });
    });
    test.describe('input with placeholder', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-input aria-label="Input with Placeholder" placeholder="Placeholder"></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input with a placeholder.
        await expect(input).toHaveScreenshot(screenshot(`input-with-placeholder`));
      });
    });

    test.describe('input with clear button', () => {
      test('should not have visual regressions with default label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Label"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input with a clear button.
        await expect(input).toHaveScreenshot(screenshot(`input-with-clear-button`));
      });
      test('should not have visual regressions with stacked label', async ({ page }) => {
        await page.setContent(
          `
          <ion-input
            label="Label"
            label-placement="stacked"
            clear-input="true"
            value="Text"
          ></ion-input>
        `,
          config
        );
        const input = page.locator('ion-input');
        // Validates the display of an input with a clear button.
        await expect(input).toHaveScreenshot(screenshot(`input-with-clear-button-stacked`));
      });
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: clear button'), () => {
    test('should clear the input when pressed', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="my label" value="abc" clear-input="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      const clearButton = input.locator('.input-clear-icon');

      await expect(input).toHaveJSProperty('value', 'abc');

      await clearButton.click();
      await page.waitForChanges();

      await expect(input).toHaveJSProperty('value', '');
    });
    /**
     * Note: This only tests the desktop focus behavior.
     * Mobile browsers have different restrictions around
     * focusing inputs, so these platforms should always
     * be tested when making changes to the focus behavior.
     */
    test('should keep the input focused when the clear button is pressed', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="my label" value="abc" clear-input="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      const nativeInput = input.locator('input');
      const clearButton = input.locator('.input-clear-icon');

      await input.click();
      await expect(nativeInput).toBeFocused();

      await clearButton.click();
      await page.waitForChanges();

      await expect(nativeInput).toBeFocused();
    });

    test('should inherit color when used in item with color property', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="primary">
          <ion-input aria-label="my label" value="Text" clear-input="true"></ion-input>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`input-with-clear-button-item-color`));
    });
  });

  test.describe(title('input: click'), () => {
    test('should trigger onclick only once when clicking the label', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });
      // Create a spy function in page context
      await page.setContent(
        `
        <ion-input
          label="Click Me"
          value="Test Value"
        ></ion-input>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const input = page.locator('label.input-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await input.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the checkbox and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-input');
    });

    test('should trigger onclick only once when clicking the wrapper', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });
      // Create a spy function in page context
      await page.setContent(
        `
        <ion-input
          label="Click Me"
          value="Test Value"
          label-placement="floating"
        ></ion-input>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const input = page.locator('div.native-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await input.click({
        position: {
          x: 1,
          y: 1,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the checkbox and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-input');
    });
  });
});
