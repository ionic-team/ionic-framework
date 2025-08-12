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
          column.numericInput = true;
          const items = [
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];

          items.forEach((item) => {
            const option = document.createElement('ion-picker-column-option');
            option.value = item.value;
            option.textContent = item.text;

            column.appendChild(option);
          });
        </script>
      `,
        config
      );

      const column = page.locator('ion-picker-column');

      const colShadowRoot = await column.evaluateHandle((el) => el.shadowRoot);
      const columnPickerOpts = await colShadowRoot.evaluateHandle((root) => root?.querySelector('.picker-opts'));

      const ionChange = await page.spyOnEvent('ionChange');
      await columnPickerOpts.evaluate((el) => el && (el as HTMLElement).focus());

      await page.keyboard.press('Digit2');

      await expect(ionChange).toHaveReceivedEventDetail({ value: 2 });
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
          const firstItems = [
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];
          firstColumn.value = 5;
          firstColumn.numericInput = true;

          firstItems.forEach((item) => {
            const option = document.createElement('ion-picker-column-option');
            option.value = item.value;
            option.textContent = item.text;

            firstColumn.appendChild(option);
          });

          const secondColumn = document.querySelector('ion-picker-column#second');
          const secondItems = [
            { text: '20', value: 20 },
            { text: '21', value: 21 },
            { text: '22', value: 22 },
            { text: '23', value: 23 },
            { text: '24', value: 24 }
          ];
          secondColumn.value = 22;
          secondColumn.numericInput = true;

          secondItems.forEach((item) => {
            const option = document.createElement('ion-picker-column-option');
            option.value = item.value;
            option.textContent = item.text;

            secondColumn.appendChild(option);
          });
        </script>
      `,
        config
      );
      const firstColumn = page.locator('ion-picker-column#first');
      const secondColumn = page.locator('ion-picker-column#second');
      const firstIonChange = await (firstColumn as E2ELocator).spyOnEvent('ionChange');
      const secondIonChange = await (secondColumn as E2ELocator).spyOnEvent('ionChange');

      const firstColShadowRoot = await firstColumn.evaluateHandle((el) => el.shadowRoot);
      const columnPickerOpts = await firstColShadowRoot.evaluateHandle((root) => root?.querySelector('.picker-opts'));

      // Focus first column
      await columnPickerOpts.evaluate((el) => el && (el as HTMLElement).focus());

      await page.keyboard.press('Digit2');

      await expect(firstIonChange).toHaveReceivedEventDetail({ value: 2 });
      await expect(firstColumn).toHaveJSProperty('value', 2);

      // Focus second column
      await page.keyboard.press('Tab');

      await page.waitForChanges();

      await page.keyboard.press('Digit2+Digit4');

      await expect(secondIonChange).toHaveReceivedEventDetail({ value: 24 });
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
          const items = [
            { text: '00', value: 12 },
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];
          column.value = 5;
          column.numericInput = true;

          items.forEach((item) => {
            const option = document.createElement('ion-picker-column-option');
            option.value = item.value;
            option.textContent = item.text;

            column.appendChild(option);
          });
        </script>
      `,
        config
      );

      const column = page.locator('ion-picker-column');

      const colShadowRoot = await column.evaluateHandle((el) => el.shadowRoot);
      const columnPickerOpts = await colShadowRoot.evaluateHandle((root) => root?.querySelector('.picker-opts'));

      const ionChange = await page.spyOnEvent('ionChange');
      await columnPickerOpts.evaluate((el) => el && (el as HTMLElement).focus());

      await page.keyboard.press('Digit0');

      await expect(ionChange).toHaveReceivedEventDetail({ value: 12 });
      await expect(column).toHaveJSProperty('value', 12);
    });

    test('should allow typing 22 in a column where the max value is 23 and not just set it to 2', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28877',
      });
      await page.setContent(
        `
    <ion-picker>
      <ion-picker-column id="hours"></ion-picker-column>
      <ion-picker-column id="minutes"></ion-picker-column>
    </ion-picker>

    <script>
      const hoursColumn = document.querySelector('ion-picker-column#hours');
      hoursColumn.numericInput = true;
      const hourItems = [
        { text: '01', value: 1 },
        { text: '02', value: 2},
        { text: '20', value: 20 },
        { text: '21', value: 21 },
        { text: '22', value: 22 },
        { text: '23', value: 23 }
      ];

      hourItems.forEach((item) => {
        const option = document.createElement('ion-picker-column-option');
        option.value = item.value;
        option.textContent = item.text;

        hoursColumn.appendChild(option);
      });

      const minutesColumn = document.querySelector('ion-picker-column#minutes');
      minutesColumn.numericInput = true;
      const minuteItems = [
        { text: '00', value: 0 },
        { text: '15', value: 15 },
        { text: '30', value: 30 },
        { text: '45', value: 45 }
      ];

      minuteItems.forEach((item) => {
        const option = document.createElement('ion-picker-column-option');
        option.value = item.value;
        option.textContent = item.text;

        minutesColumn.appendChild(option);
      });
    </script>
  `,
        config
      );

      const hoursColumn = page.locator('ion-picker-column#hours');
      const minutesColumn = page.locator('ion-picker-column#minutes');
      const hoursIonChange = await (hoursColumn as E2ELocator).spyOnEvent('ionChange');
      const minutesIonChange = await (minutesColumn as E2ELocator).spyOnEvent('ionChange');
      const highlight = page.locator('ion-picker .picker-highlight');

      const box = await highlight.boundingBox();
      if (box !== null) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }

      // Simulate typing '2230' (22 hours, 30 minutes)
      await page.keyboard.press('Digit2');
      await page.keyboard.press('Digit2');
      await page.keyboard.press('Digit3');
      await page.keyboard.press('Digit0');

      // Ensure the hours column is set to 22
      await expect(hoursIonChange).toHaveReceivedEventDetail({ value: 22 });
      await expect(hoursColumn).toHaveJSProperty('value', 22);

      // Ensure the minutes column is set to 30
      await expect(minutesIonChange).toHaveReceivedEventDetail({ value: 30 });
      await expect(minutesColumn).toHaveJSProperty('value', 30);
    });

    test('should set value to 2 and not wait for another digit when max value is 12', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28877',
      });
      await page.setContent(
        `
    <ion-picker>
      <ion-picker-column id="hours"></ion-picker-column>
      <ion-picker-column id="minutes"></ion-picker-column>
    </ion-picker>

    <script>
      const hoursColumn = document.querySelector('ion-picker-column#hours');
      hoursColumn.numericInput = true;
      const hourItems = [
        { text: '01', value: 1 },
        { text: '02', value: 2 },
        { text: '03', value: 3 },
        { text: '04', value: 4 },
        { text: '05', value: 5 },
        { text: '06', value: 6 },
        { text: '07', value: 7 },
        { text: '08', value: 8 },
        { text: '09', value: 9 },
        { text: '10', value: 10 },
        { text: '11', value: 11 },
        { text: '12', value: 12 }
      ];

      hourItems.forEach((item) => {
        const option = document.createElement('ion-picker-column-option');
        option.value = item.value;
        option.textContent = item.text;

        hoursColumn.appendChild(option);
      });

      const minutesColumn = document.querySelector('ion-picker-column#minutes');
      minutesColumn.numericInput = true;
      const minuteItems = [
        { text: '00', value: 0 },
        { text: '15', value: 15 },
        { text: '30', value: 30 },
        { text: '45', value: 45 }
      ];

      minuteItems.forEach((item) => {
        const option = document.createElement('ion-picker-column-option');
        option.value = item.value;
        option.textContent = item.text;

        minutesColumn.appendChild(option);
      });
    </script>
  `,
        config
      );

      const hoursColumn = page.locator('ion-picker-column#hours');
      const minutesColumn = page.locator('ion-picker-column#minutes');
      const hoursIonChange = await (hoursColumn as E2ELocator).spyOnEvent('ionChange');
      const minutesIonChange = await (minutesColumn as E2ELocator).spyOnEvent('ionChange');
      const highlight = page.locator('ion-picker .picker-highlight');

      const box = await highlight.boundingBox();
      if (box !== null) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }

      // Simulate typing '245' (2 hours, 45 minutes)
      await page.keyboard.press('Digit2');
      await page.keyboard.press('Digit4');
      await page.keyboard.press('Digit5');

      // Ensure the hours column is set to 2
      await expect(hoursIonChange).toHaveReceivedEventDetail({ value: 2 });
      await expect(hoursColumn).toHaveJSProperty('value', 2);

      // Ensure the minutes column is set to 45
      await expect(minutesIonChange).toHaveReceivedEventDetail({ value: 45 });
      await expect(minutesColumn).toHaveJSProperty('value', 45);
    });

    test('pressing Enter should dismiss the keyboard', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28325',
      });
      await page.setContent(
        `
        <ion-picker>
          <ion-picker-column></ion-picker-column>
        </ion-picker>

        <script>
          const column = document.querySelector('ion-picker-column');
          column.numericInput = true;
          const items = [
            { text: '01', value: 1 },
            { text: '02', value: 2 },
            { text: '03', value: 3 },
            { text: '04', value: 4 },
            { text: '05', value: 5 }
          ];

          items.forEach((item) => {
            const option = document.createElement('ion-picker-column-option');
            option.value = item.value;
            option.textContent = item.text;

            column.appendChild(option);
          });
        </script>
      `,
        config
      );

      const column = page.locator('ion-picker-column');
      await column.click();

      const input = page.locator('ion-picker input');
      await expect(input).toBeFocused();

      // pressing Enter should blur the input and therefore close the keyboard
      await page.keyboard.press('Enter');

      await expect(input).not.toBeFocused();
    });
  });
});
