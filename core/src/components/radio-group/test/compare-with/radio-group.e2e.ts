import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio-group: compare-with'), () => {
    test('should correctly set value when using compareWith string', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/compare-with', config);

      const radioGroupWithString = page.locator('#compareWithString');

      const lastRadio = radioGroupWithString.locator('ion-radio').last();
      await lastRadio.click();
      await page.waitForChanges();

      await expect(radioGroupWithString).toHaveJSProperty('value', {
        label: 'Green',
        value: 'green',
      });
      await expect(lastRadio).toHaveAttribute('aria-checked', 'true');
    });

    test('should correctly set value when using compareWith function', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/compare-with', config);

      const radioGroupWithFn = page.locator('#compareWithFn');

      const lastRadio = radioGroupWithFn.locator('ion-radio').last();
      await lastRadio.click();
      await page.waitForChanges();

      await expect(radioGroupWithFn).toHaveJSProperty('value', {
        label: 'Green',
        value: 'green',
      });
      await expect(lastRadio).toHaveAttribute('aria-checked', 'true');
    });

    test('should correctly set value when using null compareWith', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/compare-with', config);

      const radioGroupWithNull = page.locator('#compareWithNull');

      const lastRadio = radioGroupWithNull.locator('ion-radio').last();
      await lastRadio.click();
      await page.waitForChanges();

      await expect(radioGroupWithNull).toHaveJSProperty('value', {
        label: 'Green',
        value: 'green',
      });
      await expect(lastRadio).toHaveAttribute('aria-checked', 'true');
    });

    test('should work with different parameter types', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25759',
      });

      await page.setContent(
        `
        <ion-radio-group value="3"></ion-radio-group>

        <script>
          const data = [
            { id: 1, name: 'Option #1' },
            { id: 2, name: 'Option #2' },
            { id: 3, name: 'Option #3' },
          ]
          const radioGroup = document.querySelector('ion-radio-group');
          radioGroup.compareWith = (val1, val2) => {
            // convert val1 to a number
            return +val1 === val2;
          }

          data.forEach((d) => {
            const radio = document.createElement('ion-radio');

            radio.value = d.id;
            radio.textContent = d.name;

            const item = document.createElement('ion-item');
            item.appendChild(radio);

            radioGroup.appendChild(item);
          });
        </script>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      const radios = page.locator('ion-radio');

      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'false');
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'false');
      await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');

      await radios.nth(0).click();
      await page.waitForChanges();

      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'false');
      await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'false');
      await expect(radioGroup).toHaveJSProperty('value', 1);
    });
  });
});
