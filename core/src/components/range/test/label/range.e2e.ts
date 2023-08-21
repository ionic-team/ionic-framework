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
});
