import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md'], themes: ['light', 'dark'] }).forEach(({ config, title }) => {
  test.describe(title('refresher: a11y'), () => {
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

      await page.waitForSelector('ion-refresher.hydrated', { state: 'attached' });

      await dragElementBy(target, page, 0, 320, undefined, undefined, false);

      await page.waitForSelector('.arrow-container', { state: 'attached' });

      const results = await new AxeBuilder({ page }).disableRules('region').analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
