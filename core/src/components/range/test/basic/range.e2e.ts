import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('range: basic'), () => {
    test('should not emit fractional values between steps', async ({ page, pageUtils }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/21968',
      });

      await page.setContent(
        `<ion-range aria-label="range" step="0.05" min="0.1" max="1" value="0.1"></ion-range>`,
        config
      );

      const range = page.locator('ion-range');
      await pageUtils.pressKeys('Tab'); // focus range
      await pageUtils.pressKeys('ArrowRight'); // note that bug doesn't trigger if you set value manually
      await page.waitForChanges();

      await expect(range).toHaveJSProperty('value', 0.15);
    });
  });
});
