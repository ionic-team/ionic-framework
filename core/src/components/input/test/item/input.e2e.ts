import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: item'), () => {
    test('should render correctly in list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`input-list-no-fill`));
    });
    test('should render correctly in inset list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`input-inset-list-no-fill`));
    });
    test('input renders as modern when label is set asynchronously', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27085',
      });

      await page.setContent(
        `<ion-item>
          <ion-input></ion-input>
        </ion-item>
        `,
        config
      );
      const input = page.locator('ion-input');
      // Initial template should be modern
      await expect(input).not.toHaveClass(/legacy-input/);

      // Update the input label
      await input.evaluate((el: HTMLIonInputElement) => (el.label = 'New label'));
      await page.waitForChanges();

      // Template should still be modern
      await expect(input).not.toHaveClass(/legacy-input/);
    });
  });
});
