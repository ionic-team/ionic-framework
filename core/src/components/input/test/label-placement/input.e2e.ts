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
      await expect(input).toHaveScreenshot(screenshot(`input-placement-start`));
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
      await expect(input).toHaveScreenshot(screenshot(`input-placement-end`));
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
      await expect(input).toHaveScreenshot(screenshot(`input-placement-fixed`));
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
      await expect(input).toHaveScreenshot(screenshot(`input-placement-stacked-value`));
    });
    test('label should appear above the input when there is a no value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" label-placement="stacked"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-placement-stacked-no-value`));
    });
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="stacked"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-placement-stacked-long-label`));
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
      await expect(input).toHaveScreenshot(screenshot(`input-placement-floating-value`));
    });
    test('label should appear on top of the input and hide the input when there is a no value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-placement-floating-no-value`));
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

      await expect(input).toHaveScreenshot(screenshot(`input-focused-placement-floating-no-value`));
    });
    test('long label should truncate', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-placement-floating-long-label`));
    });
  });
});

/**
 * The solid and outline fills are only supported by `md` mode.
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
      await expect(input).toHaveScreenshot(screenshot(`input-placement-floating-long-label-outline`));
    });

    test('long label should truncate with solid', async ({ page }) => {
      await page.setContent(
        `
        <ion-input fill="solid" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
      `,
        config
      );
      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-placement-floating-long-label-solid`));
    });

    /**
     * The floating label must be positioned relative to `.input-wrapper` so its
     * width is not constrained when the input width collapses. These tests cover
     * both cases: a long label should retain the same available width despite
     * wide start content, and a short label should not collapse when the start
     * content takes up most of the input's width.
     */
    test('start slot content should not shrink the label', async ({ page }) => {
      await page.setContent(
        `
        <div style="width: 200px">
          <ion-input id="plain" fill="outline" label-placement="floating" value="x" label="Email Email Email Email Email Email"></ion-input>
          <ion-input id="wide-start" fill="outline" label-placement="floating" value="x" label="Email Email Email Email Email Email">
            <div slot="start" style="width: 120px; height: 24px"></div>
          </ion-input>
        </div>
      `,
        config
      );

      const labelWidth = (id: string) =>
        page.locator(`${id} .label-text`).evaluate((el: HTMLElement) => ({
          available: el.clientWidth,
          wanted: el.scrollWidth,
        }));

      const plain = await labelWidth('#plain');
      const wideStart = await labelWidth('#wide-start');

      // The label is long enough that it has to truncate in both cases
      expect(plain.wanted).toBeGreaterThan(plain.available);

      expect(wideStart.available).toBe(plain.available);
    });

    test('start slot content should not collapse a short label', async ({ page }) => {
      await page.setContent(
        `
        <div style="width: 200px">
          <ion-input fill="outline" label-placement="floating" value="x" label="Email">
            <div slot="start" style="width: 170px; height: 24px"></div>
          </ion-input>
        </div>
      `,
        config
      );

      const label = await page.locator('.label-text').evaluate((el: HTMLElement) => ({
        available: el.clientWidth,
        wanted: el.scrollWidth,
      }));

      expect(label.available).toBe(label.wanted);
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
      await expect(input).toHaveScreenshot(screenshot(`input-label-truncate`));
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
      await expect(input).toHaveScreenshot(screenshot(`input-label-slot-truncate`));
    });
  });
  test.describe(title('input: async label'), () => {
    test('input should re-render when label slot is added async', async ({ page }) => {
      await page.setContent(
        `
            <ion-input fill="solid" label-placement="stacked" placeholder="Text Input"></ion-input>
          `,
        config
      );

      const input = page.locator('ion-input');

      await input.evaluate((el: HTMLElement) => {
        const labelEl = document.createElement('div');
        labelEl.slot = 'label';
        labelEl.innerHTML = 'Email <span class="required" style="color: red">*</span';

        el.appendChild(labelEl);
      });

      await page.waitForChanges();

      await expect(input).toHaveScreenshot(screenshot(`input-async-label`));
    });
  });
  test.describe(title('input: floating/stacked label layering'), () => {
    test('label should not be covered by text field', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27812',
      });
      await page.setContent(
        `
        <style>
          .custom-input .native-wrapper {
            background: pink;
          }
        </style>
        <ion-input class="custom-input" label="My Label" label-placement="stacked"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');

      await expect(input).toHaveScreenshot(screenshot(`input-label-layering`));
    });
  });
});
