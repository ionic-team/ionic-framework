import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('title: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/title/test/basic', config);
      const wrapper = page.locator('#header-wrapper');

      // only screenshot the headers to avoid unnecessary blank space from ion-content
      await expect(wrapper).toHaveScreenshot(screenshot(`title-basic`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: special characters'), () => {
    test('should not cut off characters', async ({ page }) => {
      await page.setContent(
        `
        <ion-title size="large">ÔÔÔ</ion-title>
      `,
        config
      );

      const title = page.locator('ion-title');
      await expect(title).toHaveScreenshot(screenshot('title-characters'));
    });
  });
});
