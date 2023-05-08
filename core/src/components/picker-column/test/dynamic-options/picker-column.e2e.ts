import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/dynamic-options', config);
    });
    test.describe('single column', () => {
      test('should remove option after first render', async ({ page }) => {
        const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');

        await page.click('#single-column-remove-button');
        await ionPickerDidPresentSpy.next();

        await page.waitForChanges();

        const column = page.locator('ion-picker-column');
        const secondOption = column.locator('.picker-opt').nth(1);

        await secondOption.click();

        await page.waitForChanges();

        const pickerOpts = column.locator('.picker-opts');
        const optionsCount = await pickerOpts.locator('.picker-opt').count();

        expect(optionsCount).toBe(4);
      });

      test('should add option after first render', async ({ page }) => {
        const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');

        await page.click('#single-column-add-button');
        await ionPickerDidPresentSpy.next();

        await page.waitForChanges();

        const column = page.locator('ion-picker-column');
        const secondOption = column.locator('.picker-opt').nth(1);

        await secondOption.click();

        await page.waitForChanges();

        const pickerOpts = column.locator('.picker-opts');
        const optionsCount = await pickerOpts.locator('.picker-opt').count();

        expect(optionsCount).toBe(6);
      });
    });

    test.describe('multiple columns', () => {
      test('should remove option after first render', async ({ page }) => {
        const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');

        await page.click('#multiple-column-remove-button');
        await ionPickerDidPresentSpy.next();

        await page.waitForChanges();

        const firstColumn = page.locator('ion-picker-column').first();
        const secondOption = firstColumn.locator('.picker-opt').nth(1);

        await secondOption.click();

        await page.waitForChanges();

        const secondColumn = page.locator('ion-picker-column').last();
        const pickerOpts = secondColumn.locator('.picker-opts');
        const optionsCount = await pickerOpts.locator('.picker-opt').count();

        expect(optionsCount).toBe(4);
      });

      test('should add option after first render', async ({ page }) => {
        const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');

        await page.click('#multiple-column-add-button');
        await ionPickerDidPresentSpy.next();

        await page.waitForChanges();

        const firstColumn = page.locator('ion-picker-column').first();
        const secondOption = firstColumn.locator('.picker-opt').nth(1);

        await secondOption.click();

        await page.waitForChanges();

        const secondColumn = page.locator('ion-picker-column').last();
        const pickerOpts = secondColumn.locator('.picker-opts');
        const optionsCount = await pickerOpts.locator('.picker-opt').count();

        expect(optionsCount).toBe(6);
      });
    });
  });
});
