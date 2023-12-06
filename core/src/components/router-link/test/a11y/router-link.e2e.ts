import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('router-link: a11y  (light mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
          <main>
            <ion-router-link href="#">Router Link</ion-router-link>
            <ion-router-link href="#" class="ion-color">Router Link</ion-router-link>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'], themes: ['dark'] }).forEach(({ title, config }) => {
  test.describe(title('router-link: a11y  (dark mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
          <main>
            <ion-router-link href="#">Router Link</ion-router-link>
            <ion-router-link href="#" class="ion-color">Router Link</ion-router-link>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
