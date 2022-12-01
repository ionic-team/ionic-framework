import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe('icon: rtl', () => {
    test(title('should flip icon when rtl is active'), async ({ page }) => {
      await page.setContent(
        `
        <ion-icon name="cut" flip-rtl="true"></ion-icon>
      `,
        config
      );

      const icon = page.locator('ion-icon');
      expect(await icon.screenshot()).toMatchSnapshot(`icon-flip-${page.getSnapshotSettings()}.png`);
    });
    test(title('should not flip icon when rtl is active'), async ({ page }) => {
      await page.setContent(
        `
        <ion-icon name="cut" flip-rtl="false"></ion-icon>
      `,
        config
      );

      const icon = page.locator('ion-icon');
      expect(await icon.screenshot()).toMatchSnapshot(`icon-no-flip-${page.getSnapshotSettings()}.png`);
    });
  });
});
