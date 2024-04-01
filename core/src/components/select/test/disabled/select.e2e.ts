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
    title('select: disabled options'),
    () => {
      test('should not focus a disabled option when no value is set', async ({
        page,
        skip,
      }) => {
        // TODO (FW-2979)
        skip.browser(
          'webkit',
          'Safari 16 only allows text fields and pop-up menus to be focused.'
        );

        test.info().annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/28284',
        });

        await page.setContent(
          `
        <ion-select aria-label="Select" interface="popover">
          <ion-select-option value="a" disabled="true">A</ion-select-option>
          <ion-select-option value="b">B</ion-select-option>
        </ion-select>
      `,
          config
        );

        const select = page.locator(
          'ion-select'
        );
        const popover = page.locator(
          'ion-popover'
        );
        const ionPopoverDidPresent =
          await page.spyOnEvent(
            'ionPopoverDidPresent'
          );

        await select.click();
        await ionPopoverDidPresent.next();

        const popoverOption =
          popover.locator(
            '.select-interface-option:nth-of-type(2) ion-radio'
          );
        await expect(
          popoverOption
        ).toBeFocused();
      });
    }
  );
});
