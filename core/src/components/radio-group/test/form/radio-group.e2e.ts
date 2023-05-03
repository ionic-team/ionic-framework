import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio-group: form'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/radio-group/test/form', config);
    });

    test('selecting an option should update the value', async ({ page }) => {
      const radioGroup = page.locator('ion-radio-group');
      const ionChange = await page.spyOnEvent('ionChange');
      const griffRadio = page.locator('ion-radio[value="griff"]');
      await expect(radioGroup).toHaveAttribute('value', 'biff');

      await griffRadio.click();
      await page.waitForChanges();

      await expect(ionChange).toHaveReceivedEventDetail({ value: 'griff', event: { isTrusted: true } });
    });

    test('selecting a disabled option should not update the value', async ({ page }) => {
      const value = page.locator('#value');
      const disabledRadio = page.locator('ion-radio[value="george"]');

      await expect(value).toHaveText('');
      await expect(disabledRadio).toHaveAttribute('disabled', '');

      await disabledRadio.click({ force: true });
      await page.waitForChanges();

      await expect(value).toHaveText('');
    });
  });

  test.describe(title('radio-group: form submission'), () => {
    test('should submit radio data in a form', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27016',
      });

      await page.setContent(
        `
        <form>
          <ion-radio-group value="a" name="my-group">
            <ion-radio value="a"></ion-radio>
            <ion-radio value="b"></ion-radio>
            <ion-radio value="c"></ion-radio>
          </ion-radio-group>
        </form>
      `,
        config
      );

      const radioGroupData = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) {
          return;
        }

        const formData = new FormData(form);
        return formData.get('my-group');
      });

      await expect(radioGroupData).toBe('a');
    });
  });
});
