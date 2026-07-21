import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions/modes.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('spinner: transform'), () => {
    test('should not overwrite circular animation when transform style is applied', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/19247',
      });

      await page.setContent(
        `
          <style>
            ion-spinner {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          </style>
    
          <ion-spinner name="circular"></ion-spinner>
        `,
        config
      );

      const spinner = page.locator('ion-spinner');

      // Get initial position
      const initialBox = await spinner.boundingBox();

      // Wait for a few animation cycles
      await page.waitForTimeout(500);

      // Get position after the cycles
      const finalBox = await spinner.boundingBox();

      // The x and y coordinates should remain identical
      expect(initialBox!.x).toBe(finalBox!.x);
      expect(initialBox!.y).toBe(finalBox!.y);
    });
  });
});
