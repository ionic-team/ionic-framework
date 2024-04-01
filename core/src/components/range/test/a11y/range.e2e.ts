import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('range: a11y'),
      () => {
        test('should not have accessibility violations', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/range/test/a11y`,
            config
          );

          /**
           * Axe does not take <slot> elements into account
           * when checking color-contrast. As a result, it will
           * incorrectly report color-contrast issues: https://github.com/dequelabs/axe-core/issues/3329
           */
          const results =
            await new AxeBuilder({
              page,
            })
              .disableRules(
                'color-contrast'
              )
              .analyze();
          expect(
            results.violations
          ).toEqual([]);
        });

        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.setContent(
            `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="80" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
          `,
            config
          );

          const range = page.locator(
            'ion-range'
          );
          const rangeHandle =
            range.locator(
              '.range-knob-handle'
            );

          await rangeHandle.evaluate(
            (el) =>
              el.classList.add(
                'ion-focused'
              )
          );
          await page.waitForChanges();

          await expect(
            range
          ).toHaveScreenshot(
            screenshot(`range-focus`)
          );

          const box =
            (await rangeHandle.boundingBox())!;
          const centerX =
            box.x + box.width / 2;
          const centerY =
            box.y + box.height / 2;

          await page.mouse.move(
            centerX,
            centerY
          );
          await page.mouse.down();
          await page.waitForChanges();

          await expect(
            range
          ).toHaveScreenshot(
            screenshot(`range-active`)
          );
        });
      }
    );
  }
);

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('with pin'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.setContent(
            `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="50" pin="true" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
        `,
            config
          );

          const range = page.locator(
            'ion-range'
          );
          const rangeHandle =
            range.locator(
              '.range-knob-handle'
            );

          await rangeHandle.evaluate(
            (el) =>
              el.classList.add(
                'ion-focused'
              )
          );
          await page.waitForChanges();

          await expect(
            range
          ).toHaveScreenshot(
            screenshot(
              `range-focus-with-pin`
            )
          );
        });
      }
    );

    test.describe(
      title('range: font scaling'),
      () => {
        test('should scale text on larger font sizes', async ({
          page,
        }) => {
          // Capture both icons and text in the start/end slots
          await page.setContent(
            `
        <style>
          html {
            font-size: 310%;
          }
        </style>
        <ion-range value="50" label="Label" pin="true">
          <ion-icon name="snow" slot="start" aria-hidden="true"></ion-icon>
          <div name="snow" slot="end" aria-hidden="true">Warm</div>
        </ion-range>
      `,
            config
          );

          const range = page.locator(
            'ion-range'
          );
          const rangeHandle =
            range.locator(
              '.range-knob-handle'
            );

          // Capture the range pin in screenshots
          await rangeHandle.evaluate(
            (el) =>
              el.classList.add(
                'ion-focused'
              )
          );
          await page.waitForChanges();

          await expect(
            range
          ).toHaveScreenshot(
            screenshot(`range-scale`)
          );
        });
      }
    );
  }
);
