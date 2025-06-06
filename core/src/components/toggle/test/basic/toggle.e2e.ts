import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
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
});
