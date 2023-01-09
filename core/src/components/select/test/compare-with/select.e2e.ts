import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: compare-with', () => {
  test('should correctly set value when using compareWith property', async ({ page, skip }) => {
    skip.rtl('This is checking internal logic. RTL tests are not needed');

    await page.goto('/src/components/select/test/compare-with');

    const multipleSelect = await page.locator('#multiple');
    const singleSelect = await page.locator('#single');

    await expect(multipleSelect).toHaveJSProperty('value', [
      {
        label: 'selected by default',
        value: '1',
      },
    ]);
    await expect(singleSelect).toHaveJSProperty('value', {
      label: 'selected by default',
      value: '1',
    });
  });

  test('should work with different parameter types', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not check LTR vs RTL layouts');
    test.skip(testInfo.project.metadata.mode === 'md', 'This logic is the same across modes');
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25759',
    });

    await page.setContent(`
      <ion-select label="Select a value" value="3" placeholder="Please select"></ion-select>

      <script>
        const data = [
          { id: 1, name: 'Option #1' },
          { id: 2, name: 'Option #2' },
          { id: 3, name: 'Option #3' },
        ]
        const select = document.querySelector('ion-select');
        select.compareWith = (val1, val2) => {
          // convert val1 to a number
          return +val1 === val2;
        }

        data.forEach((d) => {
          const el = document.createElement('ion-select-option');
          el.value = d.id;
          el.innerText = d.name;

          select.appendChild(el);
        });
      </script>
    `);
    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

    const select = page.locator('ion-select');
    const selectLabel = select.locator('[part="text"]');

    await expect(selectLabel).toHaveText('Option #3');

    await select.click();
    await ionAlertDidPresent.next();

    const selectRadios = page.locator('ion-alert button.alert-radio');
    await expect(selectRadios.nth(0)).toHaveAttribute('aria-checked', 'false');
    await expect(selectRadios.nth(1)).toHaveAttribute('aria-checked', 'false');
    await expect(selectRadios.nth(2)).toHaveAttribute('aria-checked', 'true');
  });
});
