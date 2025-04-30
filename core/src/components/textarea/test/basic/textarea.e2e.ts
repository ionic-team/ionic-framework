import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: click'), () => {
    test('should trigger onclick only once when clicking the label', async ({ page }) => {
      // Create a spy function in page context
      await page.setContent(`<ion-textarea label="Textarea"></ion-textarea>`, config);

      // Track calls to the exposed function
      const clickEvent = await page.spyOnEvent('click');
      const input = page.locator('label.textarea-wrapper');

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
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-textarea');
    });
  });
});
