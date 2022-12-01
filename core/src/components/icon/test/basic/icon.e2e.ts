import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('icon: basic', () => {
    test(title('should render icon when passed'), async ({ page }) => {
      await page.setContent(
        `
        <ion-icon name="star"></ion-icon>
      `,
        config
      );

      const icon = page.locator('ion-icon');
      expect(await icon.screenshot()).toMatchSnapshot(`icon-${page.getSnapshotSettings()}.png`);
    });
  });
});
