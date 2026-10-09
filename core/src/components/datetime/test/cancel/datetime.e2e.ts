import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const getDay = (datetime: Locator, day: number, month = 5) =>
  datetime.locator(`.calendar-day[data-day="${day}"][data-month="${month}"]`);

const expectSelectedDay = async (datetime: Locator, selected: number, unselected: number) => {
  await expect(getDay(datetime, selected)).toHaveClass(/calendar-day-active/);
  await expect(getDay(datetime, unselected)).not.toHaveClass(/calendar-day-active/);
};

const openDatetime = async (page: E2EPage, didPresent: string) => {
  const ionDidPresent = await page.spyOnEvent(didPresent);
  await page.locator('ion-datetime-button #date-button').click();
  await ionDidPresent.next();
  await page.locator('ion-datetime.datetime-ready').waitFor();
};

const dismissDatetime = async (page: E2EPage, didDismiss: string, dismiss: () => Promise<unknown>) => {
  const ionDidDismiss = await page.spyOnEvent(didDismiss);
  await dismiss();
  await ionDidDismiss.next();
};

const overlays = [
  { tag: 'ion-modal', didPresent: 'ionModalDidPresent', didDismiss: 'ionModalDidDismiss' },
  { tag: 'ion-popover', didPresent: 'ionPopoverDidPresent', didDismiss: 'ionPopoverDidDismiss' },
];

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('datetime: cancel'), () => {
    overlays.forEach(({ tag, didPresent, didDismiss }) => {
      test.describe(`in an ${tag}`, () => {
        let datetime: Locator;

        test.beforeEach(async ({ page }) => {
          await page.setContent(
            `
            <ion-datetime-button datetime="datetime"></ion-datetime-button>
            <${tag}>
              <ion-datetime id="datetime" locale="en-US" presentation="date" show-default-buttons="true" value="2022-05-03"></ion-datetime>
            </${tag}>
          `,
            config
          );

          datetime = page.locator('ion-datetime');
        });

        test('should show the confirmed date when reopened after cancelling a new selection', async ({
          page,
        }, testInfo) => {
          testInfo.annotations.push({
            type: 'issue',
            description: 'https://github.com/ionic-team/ionic-framework/issues/30777',
          });

          await openDatetime(page, didPresent);
          await getDay(datetime, 10).click();
          await dismissDatetime(page, didDismiss, () => datetime.locator('#cancel-button').click());
          await openDatetime(page, didPresent);

          await expect(datetime).toHaveJSProperty('value', '2022-05-03');
          await expectSelectedDay(datetime, 3, 10);
        });

        test('should show the confirmed date when reopened after dismissing without confirming', async ({
          page,
        }, testInfo) => {
          testInfo.annotations.push({
            type: 'issue',
            description: 'https://github.com/ionic-team/ionic-framework/issues/30777',
          });

          await openDatetime(page, didPresent);
          await getDay(datetime, 10).click();
          await dismissDatetime(page, didDismiss, () =>
            page
              .locator(tag)
              .evaluate((el: HTMLIonModalElement | HTMLIonPopoverElement) => el.dismiss(undefined, 'backdrop'))
          );
          await openDatetime(page, didPresent);

          await expect(datetime).toHaveJSProperty('value', '2022-05-03');
          await expectSelectedDay(datetime, 3, 10);
        });

        test('should show the confirmed month when reopened after cancelling a selection in another month', async ({
          page,
        }, testInfo) => {
          testInfo.annotations.push({
            type: 'issue',
            description: 'https://github.com/ionic-team/ionic-framework/issues/30777',
          });

          const monthYear = datetime.locator('.calendar-month-year-toggle');
          const nextMonthButton = datetime.locator('.calendar-next-prev ion-button').nth(1);

          await openDatetime(page, didPresent);
          await nextMonthButton.click();
          await expect(monthYear).toContainText('June 2022');
          await getDay(datetime, 10, 6).click();
          await dismissDatetime(page, didDismiss, () => datetime.locator('#cancel-button').click());
          await openDatetime(page, didPresent);

          await expect(monthYear).toContainText('May 2022');
          await expect(getDay(datetime, 3)).toHaveClass(/calendar-day-active/);

          await nextMonthButton.click();
          await expect(monthYear).toContainText('June 2022');
          await expect(getDay(datetime, 10, 6)).not.toHaveClass(/calendar-day-active/);
        });

        test('should keep the new date when reopened after confirming a selection', async ({ page }) => {
          await openDatetime(page, didPresent);
          await getDay(datetime, 10).click();
          await dismissDatetime(page, didDismiss, () => datetime.locator('#confirm-button').click());
          await openDatetime(page, didPresent);

          await expect(datetime).toHaveJSProperty('value', '2022-05-10');
          await expectSelectedDay(datetime, 10, 3);
        });
      });
    });

    test('should restore the confirmed date when the cancel button is clicked on an inline datetime', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30777',
      });

      await page.setContent(
        '<ion-datetime locale="en-US" presentation="date" show-default-buttons="true" value="2022-05-03"></ion-datetime>',
        config
      );

      const datetime = page.locator('ion-datetime');
      await page.locator('ion-datetime.datetime-ready').waitFor();

      await getDay(datetime, 10).click();
      await datetime.locator('#cancel-button').click();

      await expect(datetime).toHaveJSProperty('value', '2022-05-03');
      await expectSelectedDay(datetime, 3, 10);
    });

    test('should show the confirmed date in the wheel picker when reopened after cancelling', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30777',
      });

      await page.setContent(
        `
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-modal>
          <ion-datetime id="datetime" locale="en-US" presentation="date" prefer-wheel="true" show-default-buttons="true" value="2022-05-03"></ion-datetime>
        </ion-modal>
      `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const dayOptions = datetime.locator('.day-column ion-picker-column-option');
      const activeDay = datetime.locator('.day-column ion-picker-column-option.option-active');

      await openDatetime(page, 'ionModalDidPresent');
      await dayOptions.filter({ hasText: /^10$/ }).click();
      await expect(activeDay).toHaveText('10');
      await dismissDatetime(page, 'ionModalDidDismiss', () => datetime.locator('#cancel-button').click());
      await openDatetime(page, 'ionModalDidPresent');

      await expect(datetime).toHaveJSProperty('value', '2022-05-03');
      await expect(activeDay).toHaveText('3');
    });

    test('should keep the selection when the time picker inside a popover is dismissed', async ({ page }) => {
      await page.setContent(
        `
        <ion-popover id="parent-popover">
          <ion-datetime locale="en-US" presentation="date-time" show-default-buttons="true" value="2022-05-03T13:00"></ion-datetime>
        </ion-popover>
      `,
        config
      );

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      const parentPopover = page.locator('#parent-popover');
      const datetime = page.locator('ion-datetime');

      await parentPopover.evaluate((el: HTMLIonPopoverElement) => el.present());
      await ionPopoverDidPresent.next();
      await page.locator('ion-datetime.datetime-ready').waitFor();

      await getDay(datetime, 10).click();

      /**
       * The time picker opens its own popover. Dismissing it
       * must not discard the selection in the parent popover.
       */
      await datetime.locator('.time-body').click();
      await ionPopoverDidPresent.next();
      await page.keyboard.press('Escape');
      await ionPopoverDidDismiss.next();
      await page.waitForChanges();

      await expect(parentPopover).not.toHaveClass(/overlay-hidden/);
      await expectSelectedDay(datetime, 10, 3);
    });
  });
});
