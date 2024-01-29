import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * By default ion-select only takes up
 * as much space as it needs. Justification is
 * used for when the select takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the select so we can
 * see the justification results.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('select: label'), () => {
    test.describe('select: start placement', () => {
      test('should render a start justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="start" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-start`));
      });
      test('should render an end justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="end" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-end`));
      });
      test('should render a space between justification with label in the start position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="space-between" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-start-justify-space-between`));
      });
    });

    test.describe('select: end placement', () => {
      test('should render a start justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="start" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-end-justify-start`));
      });
      test('should render an end justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="end" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-end-justify-end`));
      });
      test('should render a space between justification with label in the end position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="space-between" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-end-justify-space-between`));
      });
    });

    test.describe('select: fixed placement', () => {
      test('should render a start justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="start" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-fixed-justify-start`));
      });
      test('should render an end justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="end" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-fixed-justify-end`));
      });
      test('should render a space between justification with label in the fixed position', async ({ page }) => {
        await page.setContent(
          `

           <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="space-between" style="width: 200px"></ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-fixed-justify-space-between`));
      });
    });

    test.describe('select: floating placement', () => {
      test('label should appear above the select when there is a value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" value="apples" label-placement="floating">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-value`));
      });
      test('label should appear on top of the select when there is no value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" label-placement="floating">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-no-value`));
      });
      test('label should appear on top of the select when there is a placeholder and no value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" label-placement="floating" placeholder="Placeholder">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-no-value-placeholder`));
      });
      test('label should appear on top of the select when the select is expanded', async ({ page }) => {
        await page.setContent(
          `
           <ion-select class="select-expanded label-floating" label="Label" label-placement="floating" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-expanded`));
      });
      test('long text should truncate', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label" label-placement="floating" value="apples" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples Apples Apples Apples Apples Apples Apples Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-floating-long-text`));
      });
    });

    test.describe('select: stacked placement', () => {
      test('label should appear above the select when there is a value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" value="apples" label-placement="stacked">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-value`));
      });
      test('label should appear above the select when there is no value', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label" label-placement="stacked">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-no-value`));
      });
      test('label should appear on top of the select when the select is expanded', async ({ page }) => {
        await page.setContent(
          `
           <ion-select class="select-expanded" label="Label" label-placement="stacked" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-expanded`));
      });
      test('long text should truncate', async ({ page }) => {
        await page.setContent(
          `
           <ion-select label="Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label" label-placement="stacked" value="apples" placeholder="Select a Fruit">
             <ion-select-option value="apples">Apples Apples Apples Apples Apples Apples Apples Apples</ion-select-option>
           </ion-select>
         `,
          config
        );

        const select = page.locator('ion-select');

        await expect(select).toHaveScreenshot(screenshot(`select-label-stacked-long-text`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: label overflow'), () => {
    test('label property should be truncated with ellipses', async ({ page }) => {
      await page.setContent(
        `
            <ion-select label="Label Label Label Label Label" placeholder="Select an Item"></ion-select>
          `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-label-truncate`));
    });
    test('label slot should be truncated with ellipses', async ({ page }) => {
      await page.setContent(
        `
            <ion-select placeholder="Select an Item">
              <div slot="label">Label Label Label Label Label</div>
            </ion-select>
          `,
        config
      );

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(screenshot(`select-label-slot-truncate`));
    });
  });
});
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: alert label'), () => {
    test('should use the label prop to set the default header in an alert', async ({ page }) => {
      await page.setContent(
        `
         <ion-select label="My Alert" interface="alert">
           <ion-select-option value="a">A</ion-select-option>
         </ion-select>
       `,
        config
      );

      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await select.click();
      await ionAlertDidPresent.next();

      await expect(alert.locator('.alert-title')).toHaveText('My Alert');
    });
    test('should use the label slot to set the default header in an alert', async ({ page }) => {
      await page.setContent(
        `
         <ion-select interface="alert">
            <div slot="label">My Alert</div>
           <ion-select-option value="a">A</ion-select-option>
         </ion-select>
       `,
        config
      );

      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await select.click();
      await ionAlertDidPresent.next();

      await expect(alert.locator('.alert-title')).toHaveText('My Alert');
    });
    test('should use the label prop to set the default header in an alert if both prop and slot are set', async ({
      page,
    }) => {
      await page.setContent(
        `
         <ion-select label="My Prop Alert" interface="alert">
            <div slot="label">My Slot Alert</div>
           <ion-select-option value="a">A</ion-select-option>
         </ion-select>
       `,
        config
      );

      const select = page.locator('ion-select');
      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await select.click();
      await ionAlertDidPresent.next();

      await expect(alert.locator('.alert-title')).toHaveText('My Prop Alert');
    });
  });
});
