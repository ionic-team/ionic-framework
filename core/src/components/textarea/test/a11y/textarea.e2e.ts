import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: a11y'), () => {
    test('default layout should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-textarea label="Label" placeholder="Placeholder"></ion-textarea>
          <ion-textarea placeholder="Placeholder">
            <div slot="label">Label"></div>
          </ion-textarea>
          <ion-textarea label="Label" value="My Text"></ion-textarea>
          <ion-textarea aria-label="Label"></ion-textarea>
          <ion-textarea disabled="true" label="My Label"></ion-textarea>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('focused state should not have accessibility violations', async ({ page }) => {
      /**
       * The primary color against the focus background
       * when using fill="solid" does not meet AA
       * contrast guidelines so it excluded from the test.
       * The contrast here is a significant improvement
       * over what Ionic has had in the past, so the team
       * has decided that this tradeoff is acceptable since
       * the scope of the problem is limited to the focus
       * state with the primary color when fill="solid".
       */
      await page.setContent(
        `
        <main>
          <ion-textarea class="has-focus" label="Label" value="My Text"></ion-textarea>
          <ion-textarea class="has-focus" label-placement="floating" label="Label" value="My Text"></ion-textarea>
          <ion-textarea class="has-focus" fill="outline" label-placement="floating" label="Label" value="My Text"></ion-textarea>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('textarea: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>
        <ion-textarea label="Email" helper-text="Enter your email"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');

      await expect(textarea).toHaveScreenshot(screenshot('textarea-scale'));
    });
  });
});
