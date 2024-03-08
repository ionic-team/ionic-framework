import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/picker-column/test/standalone`, config);
    });

    test('should present picker without ion-app', async ({ page }) => {
      const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');

      const picker = page.locator('ion-picker');

      await page.click('#single-column-button');

      await ionPickerDidPresent.next();

      await expect(picker).toBeVisible();
    });

    test('should have the correct selectedIndex and prevSelected', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/21764',
      });

      const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');
      const ionPickerColChangeEvent = await page.spyOnEvent('ionPickerColChange');

      const column = page.locator('ion-picker-column');
      const secondOption = column.locator('.picker-opt').nth(1);

      await page.click('#single-column-button');

      await ionPickerDidPresent.next();

      await secondOption.click();

      await ionPickerColChangeEvent.next();

      expect(ionPickerColChangeEvent.events[0].detail.prevSelected).toBe(0);
      expect(ionPickerColChangeEvent.events[0].detail.selectedIndex).toBe(1);
    });
  });
});
