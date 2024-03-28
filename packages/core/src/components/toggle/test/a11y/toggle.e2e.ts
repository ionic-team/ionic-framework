import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-toggle>my label</ion-toggle>
          <ion-toggle aria-label="my aria label"></ion-toggle>
          <ion-toggle checked="true">Checked</ion-toggle>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});
