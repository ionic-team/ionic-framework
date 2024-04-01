import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

import type { SelectPopoverOption } from '../../select-popover-interface';
import { SelectPopoverPage } from '../fixtures';

const options: SelectPopoverOption[] = [
  {
    value: 'apple',
    text: 'Apple',
    disabled: false,
    checked: false,
  },
  {
    value: 'banana',
    text: 'Banana',
    disabled: false,
    checked: false,
  },
];

const checkedOptions: SelectPopoverOption[] =
  [
    {
      value: 'apple',
      text: 'Apple',
      disabled: false,
      checked: true,
    },
    {
      value: 'banana',
      text: 'Banana',
      disabled: false,
      checked: false,
    },
  ];

/**
 * This behavior does not vary across modes/directions.
 */
configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('select-popover: basic'),
    () => {
      test.beforeEach(
        ({ browserName }) => {
          test.skip(
            browserName === 'webkit',
            'https://ionic-cloud.atlassian.net/browse/FW-2979'
          );
        }
      );

      test.describe(
        'single selection',
        () => {
          let selectPopoverPage: SelectPopoverPage;

          test.beforeEach(
            async ({ page }) => {
              selectPopoverPage =
                new SelectPopoverPage(
                  page
                );
            }
          );

          test('clicking an unselected option should dismiss the popover', async () => {
            await selectPopoverPage.setup(
              config,
              options,
              false
            );

            await selectPopoverPage.clickOption(
              'apple'
            );
            await selectPopoverPage.ionPopoverDidDismiss.next();
            await expect(
              selectPopoverPage.popover
            ).not.toBeVisible();
          });

          test('clicking a selected option should dismiss the popover', async () => {
            await selectPopoverPage.setup(
              config,
              checkedOptions,
              false
            );

            await selectPopoverPage.clickOption(
              'apple'
            );
            await selectPopoverPage.ionPopoverDidDismiss.next();
            await expect(
              selectPopoverPage.popover
            ).not.toBeVisible();
          });

          test('pressing Space on an unselected option should dismiss the popover', async () => {
            await selectPopoverPage.setup(
              config,
              options,
              false
            );

            await selectPopoverPage.pressSpaceOnOption(
              'apple'
            );
            await selectPopoverPage.ionPopoverDidDismiss.next();
            await expect(
              selectPopoverPage.popover
            ).not.toBeVisible();
          });

          test('pressing Space on a selected option should dismiss the popover', async ({
            browserName,
          }) => {
            test.skip(
              browserName === 'firefox',
              'Same behavior as https://ionic-cloud.atlassian.net/browse/FW-2979'
            );

            await selectPopoverPage.setup(
              config,
              checkedOptions,
              false
            );

            await selectPopoverPage.pressSpaceOnOption(
              'apple'
            );
            await selectPopoverPage.ionPopoverDidDismiss.next();
            await expect(
              selectPopoverPage.popover
            ).not.toBeVisible();
          });
        }
      );
    }
  );
});

/**
 * This behavior does not vary across directions.
 * The components used inside of `ion-select-popover`
 * do have RTL logic, but those are tested in their
 * respective component test files.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'select-popover: rendering'
      ),
      () => {
        let selectPopoverPage: SelectPopoverPage;

        test.beforeEach(
          async ({ page }) => {
            selectPopoverPage =
              new SelectPopoverPage(
                page
              );
          }
        );
        test('should not have visual regressions with single selection', async () => {
          await selectPopoverPage.setup(
            config,
            checkedOptions,
            false
          );
          await selectPopoverPage.screenshot(
            screenshot,
            'select-popover-diff'
          );
        });
        test('should not have visual regressions with multiple selection', async () => {
          await selectPopoverPage.setup(
            config,
            checkedOptions,
            true
          );
          await selectPopoverPage.screenshot(
            screenshot,
            'select-popover-multiple-diff'
          );
        });
      }
    );
  }
);
