import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker: isOpen'), () => {
    test('should open and close the picker', async ({ page }) => {
      await page.goto('/src/components/picker/test/is-open', config);

      const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
      const ionPickerDidDismiss = await page.spyOnEvent('ionPickerDidDismiss');
      const picker = page.locator('ion-picker');

      await page.click('#default');

      await ionPickerDidPresent.next();
      await expect(picker).toBeVisible();

      await picker.evaluate((el: HTMLIonPickerElement) => (el.isOpen = false));

      await ionPickerDidDismiss.next();
      await expect(picker).toBeHidden();
    });
  });
});
