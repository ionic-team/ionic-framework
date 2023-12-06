import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('progress-bar: a11y  (light mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
          <main>
            <ion-progress-bar type="indeterminate" aria-label="default"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="primary" aria-label="primary"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="secondary" aria-label="secondary"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="tertiary" aria-label="tertiary"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="success" aria-label="success"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="warning" aria-label="warning"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="danger" aria-label="danger"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="light" aria-label="light"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="medium" aria-label="medium"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="dark" aria-label="dark"></ion-progress-bar>
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
  test.describe(title('progress-bar: a11y  (dark mode)'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
          <main>
            <ion-progress-bar type="indeterminate" aria-label="default"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="primary" aria-label="primary"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="secondary" aria-label="secondary"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="tertiary" aria-label="tertiary"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="success" aria-label="success"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="warning" aria-label="warning"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="danger" aria-label="danger"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="light" aria-label="light"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="medium" aria-label="medium"></ion-progress-bar>
            <ion-progress-bar type="indeterminate" color="dark" aria-label="dark"></ion-progress-bar>
          </main>
        `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
