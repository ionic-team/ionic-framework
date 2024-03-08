import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/select/test/a11y`, config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('select: a11y'), () => {
    test.describe(title('select: font scaling'), () => {
      test('should scale text on larger font sizes', async ({ page }) => {
        await page.setContent(
          `
            <style>
              html {
                font-size: 310%;
              }
            </style>
            <ion-select label="Fruit" value="apple" placeholder="Placeholder">
              <ion-select-option value="apple">Apple</ion-select-option>
              <ion-select-option value="banana">Banana</ion-select-option>
              <ion-select-option value="orange">Orange</ion-select-option>
            </ion-select>
          `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot('select-scale'));
      });
    });
  });
});
