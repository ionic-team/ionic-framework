import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('router-link: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * All page content should be contained by landmarks (main, nav, etc.)
       * By containing the badge in a main element, we can avoid this violation.
       */
      await page.setContent(
        `
          <main>
            <ion-router-link href="#">Router Link</ion-router-link>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});

configs({
  directions: ['ltr'],
  palettes: ['light', 'dark', 'high-contrast', 'high-contrast-dark'],
}).forEach(({ title, config }) => {
  test.describe(title('router-link: hue a11y'), () => {
    HUES.forEach((hue) => {
      test(`should not have accessibility violations for the ${hue} hue`, async ({ page }) => {
        await page.setContent(
          `
            <main>
              <ion-router-link href="#" hue="${hue}">Default</ion-router-link>
              <ion-router-link href="#" hue="${hue}" color="danger">Danger</ion-router-link>
            </main>
          `,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();

        expect(results.violations).toEqual([]);
      });
    });
  });
});
