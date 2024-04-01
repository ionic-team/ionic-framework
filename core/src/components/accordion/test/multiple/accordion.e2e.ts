import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ config, screenshot, title }) => {
    test.describe(
      title('accordion: multiple'),
      () => {
        test('should update value and visually expand items', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/accordion/test/multiple`,
            config
          );
          const accordionGroup =
            page.locator(
              'ion-accordion-group'
            );
          const diningHeader =
            page.locator(
              'ion-accordion[value="dining"] ion-item[slot="header"]'
            );
          const attractionsHeader =
            page.locator(
              'ion-accordion[value="attractions"] ion-item[slot="header"]'
            );

          await expect(
            accordionGroup
          ).toHaveJSProperty(
            'value',
            'attractions'
          );

          await expect(
            accordionGroup
          ).toHaveScreenshot(
            screenshot(
              'accordion-one-open'
            )
          );

          await diningHeader.click();
          await page.waitForChanges();

          await expect(
            accordionGroup
          ).toHaveJSProperty('value', [
            'attractions',
            'dining',
          ]);

          await expect(
            accordionGroup
          ).toHaveScreenshot(
            screenshot(
              'accordion-two-open'
            )
          );

          await diningHeader.click();
          await attractionsHeader.click();
          await page.waitForChanges();

          await expect(
            accordionGroup
          ).toHaveJSProperty(
            'value',
            []
          );

          await expect(
            accordionGroup
          ).toHaveScreenshot(
            screenshot(
              'accordion-zero-open'
            )
          );
        });
      }
    );
  }
);
