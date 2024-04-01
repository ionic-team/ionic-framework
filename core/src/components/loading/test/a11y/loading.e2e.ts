import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('loading: a11y'),
    () => {
      test('should set aria-labelledby with a message', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/loading/test/a11y',
          config
        );

        const ionLoadingDidPresent =
          await page.spyOnEvent(
            'ionLoadingDidPresent'
          );

        await page.click(
          '#open-message-loading'
        );

        await ionLoadingDidPresent.next();

        const results =
          await new AxeBuilder({
            page,
          }).analyze();
        expect(
          results.violations
        ).toEqual([]);
      });
      test('should set aria-labelledby with a label', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/loading/test/a11y',
          config
        );

        const ionLoadingDidPresent =
          await page.spyOnEvent(
            'ionLoadingDidPresent'
          );

        await page.click(
          '#open-label-loading'
        );

        await ionLoadingDidPresent.next();

        const results =
          await new AxeBuilder({
            page,
          }).analyze();
        expect(
          results.violations
        ).toEqual([]);
      });
    }
  );
});

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('loading: font scaling'),
      () => {
        test('should scale text on larger font sizes', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-loading message="Loading"></ion-loading>
      `,
            config
          );

          const ionLoadingDidPresent =
            await page.spyOnEvent(
              'ionLoadingDidPresent'
            );
          const loading = page.locator(
            'ion-loading'
          );

          await loading.evaluate(
            (
              el: HTMLIonLoadingElement
            ) => el.present()
          );
          await ionLoadingDidPresent.next();

          await expect(
            loading
          ).toHaveScreenshot(
            screenshot(`loading-scale`)
          );
        });
      }
    );
  }
);
