import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('range: label'), () => {
    test.describe('range: no start or end items', () => {
      test('should render a range with no visible label', async ({ page }) => {
        await page.setContent(
          `
          <ion-range legacy="true"></ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-no-items-no-label`));
      });
      test('should render label in the start placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="start">
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-no-items-start`));
      });
      test('should render label in the end placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="end">
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-no-items-end`));
      });
      test('should render label in the fixed placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="fixed">
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-no-items-fixed`));
      });
      test('should render label above the range slider', async ({ page }) => {
        await page.setContent(
          `
          <div id="container" style="padding-inline-start: 20px;">
            <ion-range label-placement="stacked">
              <span slot="label">Volume</span>
            </ion-range>
          </div>
        `,
          config
        );

        const range = page.locator('#container');

        await expect(range).toHaveScreenshot(screenshot(`range-no-items-stacked`));
      });
    });

    test.describe('range: start and end items', () => {
      test('should render a range with no visible label', async ({ page }) => {
        await page.setContent(
          `
          <ion-range legacy="true">
            <ion-icon name="volume-off" slot="start"></ion-icon>
            <ion-icon name="volume-high" slot="end"></ion-icon>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-items-no-label`));
      });
      test('should render label in the start placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="start">
            <ion-icon name="volume-off" slot="start"></ion-icon>
            <ion-icon name="volume-high" slot="end"></ion-icon>
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-items-start`));
      });
      test('should render label in the end placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="end">
            <ion-icon name="volume-off" slot="start"></ion-icon>
            <ion-icon name="volume-high" slot="end"></ion-icon>
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-items-end`));
      });
      test('should render label in the fixed placement', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="fixed">
            <ion-icon name="volume-off" slot="start"></ion-icon>
            <ion-icon name="volume-high" slot="end"></ion-icon>
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-items-fixed`));
      });
      test('should render label above the range slider', async ({ page }) => {
        await page.setContent(
          `
          <ion-range label-placement="stacked">
            <ion-icon name="volume-off" slot="start"></ion-icon>
            <ion-icon name="volume-high" slot="end"></ion-icon>
            <span slot="label">Volume</span>
          </ion-range>
        `,
          config
        );

        const range = page.locator('ion-range');

        await expect(range).toHaveScreenshot(screenshot(`range-items-stacked`));
      });
    });

    test.describe('range: label prop', () => {
      test('should render label in the start placement', async ({ page }) => {
        await page.setContent(`<ion-range label-placement="start" label="Volume"></ion-range>`, config);

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-label-prop-start`));
      });

      test('should render label in the end placement', async ({ page }) => {
        await page.setContent(`<ion-range label-placement="end" label="Volume"></ion-range>`, config);

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-label-prop-end`));
      });

      test('should render label in the fixed placement', async ({ page }) => {
        await page.setContent(`<ion-range label-placement="fixed" label="Volume"></ion-range>`, config);

        const range = page.locator('ion-range');

        expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-label-prop-fixed`));
      });
      test('should render label above the range slider', async ({ page }) => {
        await page.setContent(
          `
          <div id="container" style="padding-inline-start: 20px;">
            <ion-range label-placement="stacked" label="Volume"></ion-range>
          </div>
          `,
          config
        );

        const range = page.locator('#container');

        await expect(range).toHaveScreenshot(screenshot(`range-label-prop-stacked`));
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: label overflow'), () => {
    test('label should be truncated with ellipses', async ({ page }) => {
      await page.setContent(
        `
        <ion-range>
          <div slot="label">Temperature Temperature Temperature Temperature Temperature Temperature</div>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');

      expect(await range.screenshot()).toMatchSnapshot(screenshot(`range-label-truncate`));
    });
  });

  test.describe(title('range: with pin'), () => {
    test('should render pin below a stacked label', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="padding-inline-start: 20px;">
          <ion-range label-placement="stacked" pin="true">
            <span slot="label">Volume</span>
          </ion-range>
        </div>
      `,
        config
      );

      const container = page.locator('#container');
      const range = page.locator('ion-range');
      const knob = range.locator('.range-knob-handle');

      // Force the pin to show
      await knob.evaluate((el: HTMLElement) => el.classList.add('ion-focused'));

      await expect(container).toHaveScreenshot(screenshot(`range-stacked-pin`));
    });
  });
});
