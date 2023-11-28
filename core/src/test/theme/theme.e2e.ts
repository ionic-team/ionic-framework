import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

configs({ modes: ['md'], directions: ['ltr'], themes: ['light', 'dark'] }).forEach(({ config, title }) => {
  test.describe(title('theme'), () => {
    test.beforeAll(async ({ skip }) => {
      skip.browser('firefox');
      skip.browser('webkit');
    });

    for (const color of colors) {
      test(`color "${color}" should pass AA guidelines`, async ({ page }) => {
        await page.setContent(
          `
          <style>
            body {
              background-color: var(--ion-background-color);
            }
          </style>
          <p style="color: var(--ion-color-${color});">Hello World</p>
        `,
          config
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
});
