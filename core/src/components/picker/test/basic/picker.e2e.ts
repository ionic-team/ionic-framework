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

  test.describe(title('Test cancel buttons'), () => {
    test('cancel button 1', async ({ page }) => {
      await page.goto('/src/components/picker/test/basic', config);
      await page.click('#basicMultipleCancelBtns');
      const optBtn1 = page.locator('ion-picker button.cancel1-btn');
      await optBtn1.click();
      const confirmOptBtn1Alert = page.locator('ion-alert[data-testid=cancel1-btn-clicked]');
      const optBtn1AlertInfo = confirmOptBtn1Alert.locator('.alert-message').innerText();
      const optBtn1AlertOkBtn = confirmOptBtn1Alert.locator('.alert-button-group button');
      expect(await optBtn1AlertInfo).toBe('cancel1-btn-clicked');
      await expect(page).toHaveScreenshot(screenshot(`pickerCancelBtn1`));
      await optBtn1AlertOkBtn.click();
    });

    test('cancel button 2', async ({ page }) => {
      await page.goto('/src/components/picker/test/basic', config);
      await page.click('#basicMultipleCancelBtns');
      const optBtn2 = page.locator('ion-picker button.cancel2-btn');
      await optBtn2.click();
      const confirmOptBtn2Alert = page.locator('ion-alert[data-testid=cancel2-btn-clicked]');
      const optBtn2AlertInfo = confirmOptBtn2Alert.locator('.alert-message').innerText();
      const optBtn2AlertOkBtn = confirmOptBtn2Alert.locator('.alert-button-group button');
      expect(await optBtn2AlertInfo).toBe('cancel2-btn-clicked');
      await expect(page).toHaveScreenshot(screenshot(`pickerCancelBtn2`));
      await optBtn2AlertOkBtn.click();
    });

    test('cancel button 3', async ({ page }) => {
      await page.goto('/src/components/picker/test/basic', config);
      await page.click('#basicMultipleCancelBtns');
      const ionPickerDidDismiss = await page.spyOnEvent('ionPickerDidDismiss');
      const optBtn3 = page.locator('ion-picker button.cancel3-btn');
      await optBtn3.click();
      await ionPickerDidDismiss.next();
      expect(ionPickerDidDismiss).toHaveReceivedEventDetail({
        data: {
          hours: {
            text: '1',
            value: '01',
            columnIndex: 0,
          },
        },
        role: 'cancel',
      });
    });
  });
});
