import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/picker-column/test/dynamic-options', config);
    });

    test.describe('add option', () => {
      test('should have the style attribute', async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/21763',
        });

        const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');

        await page.click('#single-column-add-button');
        await ionPickerDidPresentSpy.next();

        await page.waitForChanges();

        const column = page.locator('ion-picker-column');

        const carrotOption = column.locator('.picker-opt').getByText('Carrot');
        await expect(carrotOption).toBeHidden();

        const secondOption = column.locator('.picker-opt').nth(1);
        await secondOption.click();

        const style = await carrotOption.getAttribute('style');
        expect(style).toContain('transform');
      });
    });

    test.describe('remove option', () => {
      test('should remove selected last option', async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/21763',
        });

        const errors: any[] = [];

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(msg);
          }
        });

        const ionPickerDidPresentSpy = await page.spyOnEvent('ionPickerDidPresent');

        await page.click('#single-column-remove-button');
        await ionPickerDidPresentSpy.next();

        await page.waitForChanges();

        const column = page.locator('ion-picker-column');

        const middleOption = column.locator('.picker-opt').nth(2);
        await middleOption.click();

        const lastOption = column.locator('.picker-opt').last();
        await lastOption.click();

        await page.waitForChanges();
        expect(errors.length).toBe(0);
      });
    });
  });
});
