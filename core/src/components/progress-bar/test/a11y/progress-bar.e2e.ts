import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('progress-bar: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
          <main>
            <ion-progress-bar type="indeterminate" aria-label="default"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" aria-label="class" color="ion-color"></ion-progress-bar>
            <ion-progress-bar buffer="0.10" value="0.02" aria-label="buffer"></ion-progress-bar>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
