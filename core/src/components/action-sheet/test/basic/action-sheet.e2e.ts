import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

import { ActionSheetFixture } from './fixture';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ config, title }) => {
  test.describe(
    title('action sheet: data'),
    () => {
      let actionSheetFixture!: ActionSheetFixture;
      test.beforeEach(
        async ({ page }) => {
          actionSheetFixture =
            new ActionSheetFixture(
              page
            );

          await page.goto(
            `/src/components/action-sheet/test/basic`,
            config
          );
        }
      );
      test('should return data', async ({
        page,
      }) => {
        const ionActionSheetDidDismiss =
          await page.spyOnEvent(
            'ionActionSheetDidDismiss'
          );

        await actionSheetFixture.open(
          '#buttonData'
        );

        const buttonOption =
          page.locator(
            'ion-action-sheet button#option'
          );
        await buttonOption.click();

        await ionActionSheetDidDismiss.next();
        expect(
          ionActionSheetDidDismiss
        ).toHaveReceivedEventDetail({
          data: { type: '1' },
          role: undefined,
        });
      });
      test('should return cancel button data', async ({
        page,
      }) => {
        const ionActionSheetDidDismiss =
          await page.spyOnEvent(
            'ionActionSheetDidDismiss'
          );

        await actionSheetFixture.open(
          '#buttonData'
        );

        const buttonOption =
          page.locator(
            'ion-action-sheet button.action-sheet-cancel'
          );
        await buttonOption.click();

        await ionActionSheetDidDismiss.next();
        expect(
          ionActionSheetDidDismiss
        ).toHaveReceivedEventDetail({
          data: { type: 'cancel' },
          role: 'cancel',
        });
      });
    }
  );
});

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ config, title }) => {
  test.describe(
    title(
      'action sheet: variant functionality'
    ),
    () => {
      let actionSheetFixture!: ActionSheetFixture;
      test.beforeEach(
        async ({ page }) => {
          actionSheetFixture =
            new ActionSheetFixture(
              page
            );

          await page.goto(
            `/src/components/action-sheet/test/basic`,
            config
          );
        }
      );
      test('should open custom backdrop action sheet', async ({
        page,
      }) => {
        await actionSheetFixture.open(
          '#customBackdrop'
        );

        const backdrop = page.locator(
          'ion-action-sheet ion-backdrop'
        );
        await expect(
          backdrop
        ).toHaveCSS('opacity', '1');
      });
      test('should open alert from action sheet', async ({
        page,
      }) => {
        const ionAlertDidPresent =
          await page.spyOnEvent(
            'ionAlertDidPresent'
          );
        await actionSheetFixture.open(
          '#alertFromActionSheet'
        );

        await page.click('#open-alert');

        await ionAlertDidPresent.next();
      });
      test('should not dismiss action sheet when backdropDismiss: false', async ({
        page,
      }) => {
        await actionSheetFixture.open(
          '#noBackdropDismiss'
        );

        const actionSheet =
          page.locator(
            'ion-action-sheet'
          );
        await actionSheet
          .locator('ion-backdrop')
          .click();

        await expect(
          actionSheet
        ).toBeVisible();
      });
    }
  );
});

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ config, title }) => {
  test.describe(
    title('action sheet: focus trap'),
    () => {
      test('it should trap focus in action sheet', async ({
        page,
        browserName,
      }) => {
        await page.goto(
          `/src/components/action-sheet/test/basic`,
          config
        );
        const actionSheetFixture =
          new ActionSheetFixture(page);

        const tabKey =
          browserName === 'webkit'
            ? 'Alt+Tab'
            : 'Tab';

        await actionSheetFixture.open(
          '#basic'
        );
        const buttons = page.locator(
          'ion-action-sheet button'
        );

        await page.keyboard.press(
          tabKey
        );
        await expect(
          buttons.nth(0)
        ).toBeFocused();

        await page.keyboard.press(
          `Shift+${tabKey}`
        );
        await expect(
          buttons.nth(4)
        ).toBeFocused();

        await page.keyboard.press(
          tabKey
        );
        await expect(
          buttons.nth(0)
        ).toBeFocused();
      });
    }
  );
});

/**
 * This behavior needs to be tested in both modes but does not vary
 * across directions due to the component only applying safe area
 * to the top and bottom
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('action-sheet: basic'),
      () => {
        test.describe(
          'safe area',
          () => {
            test('should have padding added by the safe area', async ({
              page,
            }, testInfo) => {
              testInfo.annotations.push(
                {
                  type: 'issue',
                  description:
                    'https://github.com/ionic-team/ionic-framework/issues/27777',
                }
              );
              await page.setContent(
                `
          <style>
            :root {
              --ion-safe-area-top: 60px;
              --ion-safe-area-bottom: 40px;
            }
          </style>

          <ion-action-sheet></ion-action-sheet>

          <script>
            const actionSheet = document.querySelector('ion-action-sheet');
            actionSheet.header = 'Header';
            actionSheet.subHeader = 'Sub Header';
            actionSheet.buttons = [
              'Add Reaction',
              'Copy Text',
              'Share Text',
              'Copy Link to Message',
              'Remind Me',
              'Pin File',
              'Star File',
              'Mark Unread',
              'Mark Read',
              'Edit Title',
              'Erase Title',
              'Save Image',
              'Copy Image',
              'Erase Image',
              'Delete File',
              {
                text: 'Cancel',
                role: 'cancel'
              },
            ];
          </script>
        `,
                config
              );

              const ionActionSheetDidPresent =
                await page.spyOnEvent(
                  'ionActionSheetDidPresent'
                );
              const actionSheet =
                page.locator(
                  'ion-action-sheet'
                );

              await actionSheet.evaluate(
                (
                  el: HTMLIonActionSheetElement
                ) => el.present()
              );
              await ionActionSheetDidPresent.next();

              await expect(
                actionSheet
              ).toHaveScreenshot(
                screenshot(
                  `action-sheet-safe-area`
                )
              );
            });
          }
        );
      }
    );
  }
);
