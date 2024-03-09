import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md'], themeModes: ['light', 'dark'] }).forEach(({ config, title }) => {
  test.describe(title('refresher: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-content>
          <ion-refresher class="refresher-native" slot="fixed">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
        </ion-content>
      `,
        config
      );

      const target = page.locator('body');
      const refresher = await page.locator('ion-refresher');

      await dragElementBy(target, page, 0, 320, undefined, undefined, false);

      await expect(refresher).toHaveClass(/refresher-pulling/);

      // TODO(FW-5937): Remove the disableRules once the ticket is resolved.
      const results = await new AxeBuilder({ page }).disableRules('aria-progressbar-name').analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
