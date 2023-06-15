import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: label placement start'), () => {
    test('label should appear on the starting side of the input', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="example@ionic.io" label-placement="start"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-start`));
    });
  });
  test.describe(title('input: label placement end'), () => {
    test('label should appear on the ending side of the input', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="example@ionic.io" label-placement="end"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-end`));
    });
  });
  test.describe(title('input: label placement fixed'), () => {
    test('label should appear on the starting side of the input, have a fixed width, and show ellipses', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-input label="Email Email Email Email Email Email" value="example@ionic.io" label-placement="fixed"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-fixed`));
    });
  });
  test.describe(title('input: label placement stacked'), () => {
    test('label should appear above the input when there is a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="example@ionic.io" label-placement="stacked"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-stacked-value`));
    });
    test('label should appear above the input when there is a no value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" label-placement="stacked"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-stacked-no-value`));
    });
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="stacked"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-stacked-long-label`));
    });
  });
  test.describe(title('input: label placement floating'), () => {
    test('label should appear above the input when there is a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="example@ionic.io" label-placement="floating"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-floating-value`));
    });
    test('label should appear on top of the input and hide the input when there is a no value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-floating-no-value`));
    });
    test('label should appear on top of the input when the input is focused', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      const nativeInput = input.locator('input');

      await nativeInput.click();
      await page.waitForChanges();

      expect(await input.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        screenshot(`input-focused-placement-floating-no-value`)
      );
    });
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-floating-long-label`));
    });
  });
});

/**
 * This style only appears on MD
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: label with fill'), () => {
    test('long label should truncate with outline', async ({ page }) => {
      await page.setContent(
        `
        <ion-input fill="outline" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-floating-long-label-outline`));
    });
    test('long label should truncate with solid', async ({ page }) => {
      await page.setContent(
        `
        <ion-input fill="solid" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-placement-floating-long-label-solid`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: label overflow'), () => {
    test('label property should be truncated with an ellipsis', async ({ page }) => {
      await page.setContent(
        `
            <ion-input label="Label Label Label Label Label" placeholder="Text Input"></ion-input>
          `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-label-truncate`));
    });
    test('label slot should be truncated with an ellipsis', async ({ page }) => {
      await page.setContent(
        `
            <ion-input placeholder="Text Input">
              <div slot="label">Label Label Label Label Label</div>
            </ion-input>
          `,
        config
      );

      const input = page.locator('ion-input');
      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-label-slot-truncate`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: async label'), () => {
    test('input should re-render when label slot is added async', async ({ page }) => {
      await page.setContent(
        `
            <ion-input fill="solid" label-placement="stacked" placeholder="Text Input"></ion-input>
          `,
        config
      );

      const input = page.locator('ion-input');

      await input.evaluate((el: HTMLIonInputElement) => {
        const labelEl = document.createElement('div');
        labelEl.slot = 'label';
        labelEl.innerHTML = 'Email <span class="required" style="color: red">*</span';

        el.appendChild(labelEl);
      });

      await page.waitForChanges();

      expect(await input.screenshot()).toMatchSnapshot(screenshot(`input-async-label`));
    });
  });
});
