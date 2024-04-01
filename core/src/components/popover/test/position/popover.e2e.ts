import { expect } from '@playwright/test';
import {
  configs,
  test,
  Viewports,
} from '@utils/test/playwright';

import { openPopover } from '../test.utils';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('popover: position'),
      async () => {
        /**
         * The popovers have showBackdrop=false so we can open all of them at once
         * and massively cut down on screenshots taken. The content has its own
         * backdrop so you can still see the popovers.
         */
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/popover/test/position',
            config
          );
          await page.setViewportSize(
            Viewports.tablet.portrait
          ); // avoid extra-long viewport screenshots

          const sides = [
            'top',
            'right',
            'bottom',
            'left',
            'start',
            'end',
          ];
          const alignments = [
            'start',
            'center',
            'end',
          ];

          for (const side of sides) {
            for (const alignment of alignments) {
              await openPopover(
                page,
                `${side}-${alignment}`,
                true
              );
            }
          }

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `popover-position`
            )
          );
        });
      }
    );
  }
);
