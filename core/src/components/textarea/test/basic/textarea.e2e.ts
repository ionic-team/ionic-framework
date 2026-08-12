import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: basic'), () => {
    test('should stretch to fill height when min-height is set on the host', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Label" label-placement="floating" style="min-height: 150px"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      const control = page.locator('ion-textarea .textarea-control');

      // Get the height of the host
      const textareaHeight = await textarea.evaluate((el) => el.clientHeight);

      // Get the height of the textarea control
      const controlHeight = await control.boundingBox().then((el) => el?.height);

      // The height of the host and control should be the same
      expect(textareaHeight).toBe(controlHeight);
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: click'), () => {
    test('should trigger onclick only once when clicking the label', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });
      // Create a spy function in page context
      await page.setContent(
        `
        <ion-textarea
          label="Click Me"
          value="Test Value"
        ></ion-textarea>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const textarea = page.locator('label.textarea-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await textarea.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the textarea and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-textarea');
    });

    test('should trigger onclick only once when clicking the wrapper', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30165',
      });
      // Create a spy function in page context
      await page.setContent(
        `
        <ion-textarea
          label="Click Me"
          value="Test Value"
          label-placement="floating"
        ></ion-textarea>
      `,
        config
      );

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const textarea = page.locator('div.native-wrapper');

      // Use position to make sure we click into the label enough to trigger
      // what would be the double click
      await textarea.click({
        position: {
          x: 1,
          y: 1,
        },
      });

      // Verify the click was triggered exactly once
      expect(clickEvent).toHaveReceivedEventTimes(1);

      // Verify that the event target is the textarea and not the item
      const event = clickEvent.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-textarea');
    });

    test('should propagate clicks from start slot button to parent', async ({ page }) => {
      await page.setContent(
        `
        <div id="parent" onclick="window.parentClicks = (window.parentClicks || 0) + 1">
          Parent Container
          <ion-textarea value="test@ionic.io" label="Email">
            <ion-button slot="start" onclick="window.buttonClicks = (window.buttonClicks || 0) + 1">Icon</ion-button>
          </ion-textarea>
        </div>
      `,
        config
      );

      const button = page.locator('ion-button[slot="start"]');
      const parent = page.locator('#parent');

      // Click the button in the start slot
      await button.click();

      // The button's own click handler should have fired
      let buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);

      // The parent's click handler should also have fired
      let parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(1);

      // Click on the parent container (far right to avoid the start button)
      await parent.click({ position: { x: 250, y: 50 } });

      // Parent should have incremented
      parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(2);

      // Button should NOT have incremented
      buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);
    });

    test('should propagate clicks from end slot button to parent', async ({ page }) => {
      await page.setContent(
        `
        <div id="parent" onclick="window.parentClicks = (window.parentClicks || 0) + 1">
          Parent Container
          <ion-textarea value="test@ionic.io" label="Email">
            <ion-button slot="end" onclick="window.buttonClicks = (window.buttonClicks || 0) + 1">Toggle</ion-button>
          </ion-textarea>
        </div>
      `,
        config
      );

      const button = page.locator('ion-button[slot="end"]');
      const parent = page.locator('#parent');

      // Click the button in the end slot
      await button.click();

      // The button's own click handler should have fired
      let buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);

      // The parent's click handler should also have fired
      let parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(1);

      // Click on the parent container (far left to avoid the end button)
      await parent.click({ position: { x: 10, y: 50 } });

      // Parent should have incremented
      parentClicks = await page.evaluate(() => (window as any).parentClicks);
      expect(parentClicks).toBe(2);

      // Button should NOT have incremented
      buttonClicks = await page.evaluate(() => (window as any).buttonClicks);
      expect(buttonClicks).toBe(1);
    });
  });
});
