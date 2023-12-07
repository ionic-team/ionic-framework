import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: a11y'), () => {
    test('default layout should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-select label="Label" placeholder="Placeholder"></ion-select>
          <ion-select placeholder="Placeholder">
            <div slot="label">Label"></div>
          </ion-select>
          <ion-select label="Label" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
          <ion-select aria-label="Label"></ion-select>
          <ion-select disabled="true" label="My Label"></ion-select>
          <ion-item>
            <ion-select label="My Label" value="apples">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-select id="multiple" multiple="true" label="My Label">
            <ion-select-option value="apples">Apples</ion-select-option>
            <ion-select-option value="bananas">Bananas</ion-select-option>
            <ion-select-option value="oranges">Oranges</ion-select-option>
          </ion-select>

          <script>
            const multiple = document.querySelector('#multiple');
            multiple.value = ['apples', 'bananas'];
          </script>
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
          <ion-select class="has-focus" label="Label" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
          <ion-select class="has-focus" label-placement="floating" label="Label" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
          <ion-select class="has-focus" fill="outline" label-placement="floating" label="Label" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
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
