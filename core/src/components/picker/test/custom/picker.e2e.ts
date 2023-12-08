import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const pickerElement = `
  <ion-picker>
    <ion-picker-column id="first"></ion-picker-column>
    <ion-picker-column id="second"></ion-picker-column>
  </ion-picker>

  <script>
    const setPickerColumn = (selector, items, value) => {
      const column = document.querySelector(selector);

      items.forEach((item) => {
        const option = document.createElement('ion-picker-column-option');
        option.value = item.value;
        option.textContent = item.text;

        option.setAttribute('data-test-value', item.value);

        column.appendChild(option);
      });

      column.value = value;
    };

    setPickerColumn(
      '#first',
      [
        { text: 'Minified', value: 'minified' },
        { text: 'Responsive', value: 'responsive' },
        { text: 'Full Stack', value: 'full-stack' },
        { text: 'Mobile First', value: 'mobile-first' },
        { text: 'Serverless', value: 'serverless' },
      ],
      'minified'
    );

    setPickerColumn(
      '#second',
      [
        { text: 'Tomato', value: 'tomato' },
        { text: 'Avocado', value: 'avocado' },
        { text: 'Onion', value: 'onion' },
        { text: 'Potato', value: 'potato' },
        { text: 'Artichoke', value: 'artichoke' },
      ],
      'tomato'
    );
  </script>
`;

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker: custom'), () => {
    test('should allow styling of the picker highlight', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-picker {
            --highlight-background: rgb(0, 255, 0, 0.4);
            --highlight-border-radius: 48px;
          }
        </style>
        ${pickerElement}
      `,
        config
      );

      const picker = page.locator('ion-picker');

      await expect(picker).toHaveScreenshot(screenshot(`picker-custom-highlight`));
    });

    test('should allow styling of the picker fade', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-picker {
            --fade-background-rgb: 40, 40, 40;
          }
        </style>
        ${pickerElement}
      `,
        config
      );

      const picker = page.locator('ion-picker');

      await expect(picker).toHaveScreenshot(screenshot(`picker-custom-fade`));
    });
  });
});
