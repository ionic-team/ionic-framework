import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio: value'), () => {
    test('should report a non-string value to the radio group when selected', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31394',
      });

      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio>Restricted</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await radio.evaluate((el: HTMLIonRadioElement) => (el.value = true));
      await page.waitForChanges();

      await radio.click();
      await page.waitForChanges();

      const groupValue = await page.locator('ion-radio-group').evaluate((el: HTMLIonRadioGroupElement) => el.value);

      expect(groupValue).toBe(true);
    });

    test('should clear an object value when it is set back to null', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio>Restricted</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await radio.evaluate((el: HTMLIonRadioElement) => (el.value = { id: 1 }));
      await page.waitForChanges();

      await radio.evaluate((el: HTMLIonRadioElement) => (el.value = null));
      await page.waitForChanges();

      const value = await radio.evaluate((el: HTMLIonRadioElement) => el.value);

      expect(value).toBe(null);
    });

    test('should reflect a string value to the attribute', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio>Public</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await radio.evaluate((el: HTMLIonRadioElement) => (el.value = 'public'));
      await page.waitForChanges();

      await expect(radio).toHaveAttribute('value', 'public');
    });
  });
});
