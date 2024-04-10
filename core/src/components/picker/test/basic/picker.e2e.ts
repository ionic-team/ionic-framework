import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('picker: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/picker/test/basic', config);
      const didPresent = await page.spyOnEvent('ionPickerDidPresent');
      const didDismiss = await page.spyOnEvent('ionPickerDidDismiss');

      await page.click('#basic');
      await didPresent.next();
      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`picker-basic`));

      await page.click('.picker-opt:nth-child(2)');
      await page.click('ion-picker .save-btn');
      await didDismiss.next();

      await page.click('#basic');
      await didPresent.next();
      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`picker-value-selected`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('picker: button handlers'), () => {
    test('should call cancel button handler', async ({ page }) => {
      await page.setContent(
        `
      <script type="module">
        import { pickerController } from '../../../../dist/ionic/index.esm.js';
        window.pickerController = pickerController;
      </script>

      <button id="open" onclick="openPicker()">Open Picker</button>

      <div id="result"></div>

      <script>
        async function openPicker() {
          const picker = await pickerController.create({
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'cancel-btn',
                handler: () => {
                  document.querySelector('#result').textContent = 'cancelled';
                }
              }
            ]
          });
          await picker.present();
        }
      </script>
      `,
        config
      );

      const didPresent = await page.spyOnEvent('ionPickerDidPresent');

      const openBtn = page.locator('#open');
      await openBtn.click();

      await didPresent.next();

      const cancelBtn = page.locator('ion-picker .cancel-btn');
      await cancelBtn.click();

      const result = page.locator('#result');
      await expect(result).toHaveText('cancelled');
    });
  });
});
