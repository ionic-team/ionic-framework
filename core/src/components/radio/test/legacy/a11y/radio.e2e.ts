import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('radio: a11y'),
    () => {
      test.beforeEach(
        async ({
          page,
          browserName,
        }) => {
          await page.goto(
            `/src/components/radio/test/legacy/a11y`,
            config
          );

          if (
            browserName === 'webkit'
          ) {
            const radio = page
              .locator(
                '#first-group ion-radio'
              )
              .first();
            /**
             * Sometimes Safari does not focus the first radio.
             * This is a workaround to ensure the first radio is focused.
             *
             * Wait for the first radio to be rendered before tabbing.
             * This is necessary because the first radio may not be rendered
             * when the page first loads.
             *
             * This would cause the first radio to be skipped when tabbing.
             */
            await radio.waitFor();
          }
        }
      );
      test('tabbing should switch between radio groups', async ({
        page,
        pageUtils,
      }) => {
        const firstGroupRadios =
          page.locator(
            '#first-group ion-radio'
          );
        const secondGroupRadios =
          page.locator(
            '#second-group ion-radio'
          );

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          firstGroupRadios.nth(0)
        ).toBeFocused();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          secondGroupRadios.nth(0)
        ).toBeFocused();

        await pageUtils.pressKeys(
          'shift+Tab'
        );
        await expect(
          firstGroupRadios.nth(0)
        ).toBeFocused();
      });
      test('using arrow keys should move between enabled radios within group', async ({
        page,
        pageUtils,
      }) => {
        const firstGroupRadios =
          page.locator(
            '#first-group ion-radio'
          );

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          firstGroupRadios.nth(0)
        ).toBeFocused();

        await page.keyboard.press(
          'ArrowDown'
        );
        await expect(
          firstGroupRadios.nth(1)
        ).toBeFocused();

        // firstGroupRadios.nth(2) is disabled so it should not receive focus.
        await page.keyboard.press(
          'ArrowDown'
        );
        await expect(
          firstGroupRadios.nth(3)
        ).toBeFocused();

        await page.keyboard.press(
          'ArrowDown'
        );
        await expect(
          firstGroupRadios.nth(0)
        ).toBeFocused();

        await page.keyboard.press(
          'ArrowUp'
        );
        await expect(
          firstGroupRadios.nth(3)
        ).toBeFocused();
      });
    }
  );
});
