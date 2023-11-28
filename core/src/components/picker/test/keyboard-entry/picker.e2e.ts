import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2ELocator } from '@utils/test/playwright/page/utils/locator';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker: keyboard entry'), () => {
    test('should scroll to and update the value prop for a single column', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column></ion-picker-column>
        </ion-picker>

        <script>
          const column = document.querySelector('ion-picker-column');
          column.items = [
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];
          column.value = 5;
          column.numericInput = true;
        </script>
      `,
        config
      );

      const column = page.locator('ion-picker-column');
      const ionChange = await page.spyOnEvent('ionChange');
      await column.focus();

      await page.keyboard.press('Digit2');

      await expect(ionChange).toHaveReceivedEventDetail({ text: '02', value: 2 });
      await expect(column).toHaveJSProperty('value', 2);
    });

    test('should scroll to and update the value prop for multiple columns', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column id="first"></ion-picker-column>
          <ion-picker-column id="second"></ion-picker-column>
        </ion-picker>

        <script>
          const firstColumn = document.querySelector('ion-picker-column#first');
          firstColumn.items = [
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];
          firstColumn.value = 5;
          firstColumn.numericInput = true;

          const secondColumn = document.querySelector('ion-picker-column#second');
          secondColumn.items = [
            { text: '20', value: 20 },
            { text: '21', value: 21 },
            { text: '22', value: 22 },
            { text: '23', value: 23 },
            { text: '24', value: 24 }
          ];
          secondColumn.value = 22;
          secondColumn.numericInput = true;
        </script>
      `,
        config
      );

      const firstColumn = page.locator('ion-picker-column#first');
      const secondColumn = page.locator('ion-picker-column#second');
      const highlight = page.locator('ion-picker .picker-highlight');
      const firstIonChange = await (firstColumn as E2ELocator).spyOnEvent('ionChange');
      const secondIonChange = await (secondColumn as E2ELocator).spyOnEvent('ionChange');

      const box = await highlight.boundingBox();
      if (box !== null) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }

      await expect(firstColumn).toHaveClass(/picker-column-active/);
      await expect(secondColumn).toHaveClass(/picker-column-active/);

      await page.keyboard.press('Digit2');

      await expect(firstIonChange).toHaveReceivedEventDetail({ text: '02', value: 2 });
      await expect(firstColumn).toHaveJSProperty('value', 2);

      await page.keyboard.press('Digit2+Digit4');

      await expect(secondIonChange).toHaveReceivedEventDetail({ text: '24', value: 24 });
      await expect(secondColumn).toHaveJSProperty('value', 24);
    });

    test('should select 00', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column></ion-picker-column>
        </ion-picker>

        <script>
          const column = document.querySelector('ion-picker-column');
          column.items = [
            { text: '00', value: 12 },
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];
          column.value = 5;
          column.numericInput = true;
        </script>
      `,
        config
      );

      const column = page.locator('ion-picker-column');
      const ionChange = await page.spyOnEvent('ionChange');
      await column.focus();

      await page.keyboard.press('Digit0');

      await expect(ionChange).toHaveReceivedEventDetail({ text: '00', value: 12 });
      await expect(column).toHaveJSProperty('value', 12);
    });
  });
});
