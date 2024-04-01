import {
  configs,
  test,
} from '@utils/test/playwright';

import { PopoverFixture } from '../fixture';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('popover: reference'),
      async () => {
        let popoverFixture!: PopoverFixture;
        test.beforeEach(
          async ({ page }) => {
            popoverFixture =
              new PopoverFixture(page);
            await popoverFixture.goto(
              `src/components/popover/test/reference`,
              config
            );
          }
        );

        test('should position popover relative to mouse click', async () => {
          await popoverFixture.open(
            '#event-trigger'
          );
          await popoverFixture.screenshot(
            'reference-event-trigger',
            screenshot
          );
        });

        test('should position popover relative to trigger', async () => {
          await popoverFixture.open(
            '#trigger-trigger'
          );
          await popoverFixture.screenshot(
            'reference-trigger-trigger',
            screenshot
          );
        });
      }
    );
  }
);
