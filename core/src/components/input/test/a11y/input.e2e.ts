import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('input: a11y'), () => {
    test('default layout should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-input label="Label" placeholder="Placeholder"></ion-input>
          <ion-input placeholder="Placeholder">
            <div slot="label">Label"></div>
          </ion-input>
          <ion-input label="Label" value="My Text"></ion-input>
          <ion-input aria-label="Label"></ion-input>
          <ion-input label="Email" fill="solid" value="hi@ionic.io">
            <ion-icon slot="start" name="lock-closed" aria-hidden="true"></ion-icon>
            <ion-button slot="end" aria-label="button">
              <ion-icon slot="icon-only" name="lock-closed" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
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
          <ion-input class="has-focus" label="Label" value="My Text"></ion-input>
          <ion-input class="has-focus" label-placement="floating" label="Label" value="My Text"></ion-input>
          <ion-input class="has-focus" fill="outline" label-placement="floating" label="Label" value="My Text"></ion-input>
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
  test.describe(title('input: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
          <style>
            html {
              font-size: 310%;
            }
          </style>
          <ion-input label="Email" helper-text="Enter your email"></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot('input-scale'));
    });
  });
});
