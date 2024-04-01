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
    title('overlays: dismiss'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/utils/test/overlays',
            config
          );
        }
      );
      test('hardware back button: should dismiss a presented overlay', async ({
        page,
      }) => {
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        await page.click(
          '#create-and-present'
        );

        await ionModalDidPresent.next();

        await page.click(
          '#modal-simulate'
        );

        await ionModalDidDismiss.next();
      });

      test('hardware back button: should dismiss the presented overlay, even though another hidden modal was added last', async ({
        page,
      }) => {
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        await page.click(
          '#create-and-present'
        );

        await ionModalDidPresent.next();

        await page.click(
          '#modal-create'
        );

        const modals = page.locator(
          'ion-modal'
        );
        await expect(
          await modals.count()
        ).toEqual(2);

        await expect(
          await modals.nth(0)
        ).not.toHaveClass(
          /overlay-hidden/
        );
        await expect(
          await modals.nth(1)
        ).toHaveClass(/overlay-hidden/);

        await page.click(
          '#modal-simulate'
        );

        await ionModalDidDismiss.next();

        await expect(
          await modals.count()
        ).toEqual(1);
        await expect(
          await modals.nth(0)
        ).toHaveClass(/overlay-hidden/);
      });

      test('Esc: should dismiss a presented overlay', async ({
        page,
      }) => {
        const createAndPresentButton =
          page.locator(
            '#create-and-present'
          );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        await createAndPresentButton.click();

        await ionModalDidPresent.next();

        await page.keyboard.press(
          'Escape'
        );

        await ionModalDidDismiss.next();
      });

      test('Esc: should dismiss the presented overlay, even though another hidden modal was added last', async ({
        page,
      }) => {
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        await page.click(
          '#create-and-present'
        );

        await ionModalDidPresent.next();

        await page.click(
          '#modal-create'
        );

        const modals = page.locator(
          'ion-modal'
        );
        await expect(
          await modals.count()
        ).toEqual(2);

        await expect(
          await modals.nth(0)
        ).not.toHaveClass(
          /overlay-hidden/
        );
        await expect(
          await modals.nth(1)
        ).toHaveClass(/overlay-hidden/);

        await page.keyboard.press(
          'Escape'
        );

        await ionModalDidDismiss.next();

        await expect(
          await modals.count()
        ).toEqual(1);
        await expect(
          await modals.nth(0)
        ).toHaveClass(/overlay-hidden/);
      });

      test('overlays: Nested: should dismiss the top overlay', async ({
        page,
      }) => {
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        await page.click(
          '#create-nested'
        );

        await ionModalDidPresent.next();

        await page.click(
          '#dismiss-modal-nested-overlay'
        );

        await ionModalDidDismiss.next();

        const modals = page.locator(
          'ion-modal'
        );
        expect(
          await modals.count()
        ).toEqual(0);
      });
    }
  );

  test.describe(
    title('overlays: focus'),
    () => {
      test('should not select a hidden focusable element', async ({
        page,
        pageUtils,
      }) => {
        await page.setContent(
          `
        <style>
          [hidden] {
            display: none;
          }
        </style>

        <ion-button id="open-modal">Show Modal</ion-button>
        <ion-modal trigger="open-modal">
          <ion-content>
            <ion-button hidden id="hidden">Hidden Button</ion-button>
            <ion-button id="visible">Visible Button</ion-button>
          </ion-content>
        </ion-modal>
      `,
          config
        );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const presentButton =
          page.locator(
            'ion-button#open-modal'
          );
        const visibleButton =
          page.locator(
            'ion-button#visible'
          );

        await presentButton.click();
        await ionModalDidPresent.next();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          visibleButton
        ).toBeFocused();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          visibleButton
        ).toBeFocused();
      });

      test('should not select a disabled focusable element', async ({
        page,
        pageUtils,
      }) => {
        await page.setContent(
          `
        <ion-button id="open-modal">Show Modal</ion-button>
        <ion-modal trigger="open-modal">
          <ion-content>
            <ion-button disabled="true" id="disabled">Button</ion-button>
            <ion-button id="active">Active Button</ion-button>
          </ion-content>
        </ion-modal>
      `,
          config
        );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const presentButton =
          page.locator(
            'ion-button#open-modal'
          );
        const activeButton =
          page.locator(
            'ion-button#active'
          );

        await presentButton.click();
        await ionModalDidPresent.next();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          activeButton
        ).toBeFocused();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          activeButton
        ).toBeFocused();
      });

      test('should select a focusable element with disabled="false"', async ({
        page,
        pageUtils,
      }) => {
        await page.setContent(
          `
        <ion-button id="open-modal">Show Modal</ion-button>
        <ion-modal trigger="open-modal">
          <ion-content>
            <ion-button disabled="false" id="disabled-false">Button</ion-button>
            <ion-button id="active">Active Button</ion-button>
          </ion-content>
        </ion-modal>
      `,
          config
        );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const presentButton =
          page.locator(
            'ion-button#open-modal'
          );
        const disabledFalseButton =
          page.locator(
            'ion-button#disabled-false'
          );
        const activeButton =
          page.locator(
            'ion-button#active'
          );

        await presentButton.click();
        await ionModalDidPresent.next();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          disabledFalseButton
        ).toBeFocused();

        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          activeButton
        ).toBeFocused();

        // Loop back to beginning of overlay
        await pageUtils.pressKeys(
          'Tab'
        );
        await expect(
          disabledFalseButton
        ).toBeFocused();
      });

      test('toast should not cause focus trapping', async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/test/overlays',
          config
        );
        const ionToastDidPresent =
          await page.spyOnEvent(
            'ionToastDidPresent'
          );

        await page.click(
          '#create-and-present-toast'
        );
        await ionToastDidPresent.next();

        const input = page.locator(
          '#root-input input'
        );
        await input.click();

        await expect(
          input
        ).toBeFocused();
      });

      test('toast should not cause focus trapping even when opened from a focus trapping overlay', async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/test/overlays',
          config
        );

        const ionToastDidPresent =
          await page.spyOnEvent(
            'ionToastDidPresent'
          );
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );

        await page.click(
          '#create-and-present'
        );
        await ionModalDidPresent.next();

        await page.click(
          '#modal-toast'
        );
        await ionToastDidPresent.next();

        const modalInput = page.locator(
          '.modal-input input'
        );
        await modalInput.click();

        await expect(
          modalInput
        ).toBeFocused();
      });

      test('focus trapping should only run on the top-most overlay', async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/test/overlays',
          config
        );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );

        await page.click(
          '#create-and-present'
        );
        await ionModalDidPresent.next();

        const modalInputZero =
          page.locator(
            '.modal-0 .modal-input input'
          );
        await modalInputZero.click();

        await expect(
          modalInputZero
        ).toBeFocused();

        await page.click(
          '#modal-create-and-present'
        );
        await ionModalDidPresent.next();

        const modalInputOne =
          page.locator(
            '.modal-1 .modal-input input'
          );
        await modalInputOne.click();

        await expect(
          modalInputOne
        ).toBeFocused();
      });

      test('focusing toast from a shadow overlay should return focus to the last focused element', async ({
        page,
      }) => {
        test.info().annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/28261',
        });

        /**
         * Triggers for an overlay are typically buttons. However in this case,
         * buttons are not considered keyboard focusable by WebKit. Inputs are,
         * so we use an input here so we can still test on WebKit.
         */
        await page.setContent(
          `
        <ion-modal>
          <ion-content>
            <input id="show-toast">Button A</input>
            <button>Button B</button>
            <ion-toast trigger="show-toast"></ion-toast>
          </ion-content>
        </ion-modal>

        <script>
          const toast = document.querySelector('ion-toast');
          toast.buttons = ['Ok'];
        </script>
      `,
          config
        );

        const modal = page.locator(
          'ion-modal'
        );
        const showToastTrigger =
          page.locator('#show-toast');

        const toast = page.locator(
          'ion-toast'
        );
        const toastButton =
          toast.locator('button');

        const ionToastDidPresent =
          await page.spyOnEvent(
            'ionToastDidPresent'
          );

        // Show overlay
        await modal.evaluate(
          (el: HTMLIonModalElement) =>
            el.present()
        );

        // Click trigger to open toast
        await showToastTrigger.click();

        // Wait for toast to be presented
        await ionToastDidPresent.next();

        // Verify trigger in overlay is focused
        await expect(
          showToastTrigger
        ).toBeFocused();

        // Click a button in the toast and therefore attempt to move focus
        await toastButton.click();

        // Verify trigger in overlay is still focused
        await expect(
          showToastTrigger
        ).toBeFocused();
      });

      test('focusing toast from a scoped overlay should return focus to the last focused element', async ({
        page,
        skip,
      }) => {
        test.info().annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/28261',
        });
        skip.browser(
          'webkit',
          'WebKit does not consider buttons to be focusable'
        );

        await page.setContent(
          `
        <ion-action-sheet></ion-action-sheet>
        <ion-toast></ion-toast>

        <script>
          const actionSheet = document.querySelector('ion-action-sheet');
          actionSheet.buttons = [
            'Other Button',
            {
              text: 'Button',
              id: 'show-toast',
              handler: () => {
                document.querySelector('ion-toast').present();
                return false;
              }
            }
          ];

          const toast = document.querySelector('ion-toast');
          toast.buttons = ['Ok'];
       </script>
       `,
          config
        );

        const actionSheet =
          page.locator(
            'ion-action-sheet'
          );
        const showToastButton =
          page.locator('#show-toast');

        const toast = page.locator(
          'ion-toast'
        );
        const toastButton =
          toast.locator('button');

        const ionToastDidPresent =
          await page.spyOnEvent(
            'ionToastDidPresent'
          );

        // Show overlay
        await actionSheet.evaluate(
          (
            el: HTMLIonActionSheetElement
          ) => el.present()
        );

        // Click button to open toast
        await showToastButton.click();

        // Wait for toast to be presented
        await ionToastDidPresent.next();

        // Verify button in overlay is focused
        await expect(
          showToastButton
        ).toBeFocused();

        // Click a button in the toast and therefore attempt to move focus
        await toastButton.click();

        await page.pause();

        // Verify button in overlay is still focused
        await expect(
          showToastButton
        ).toBeFocused();
      });
      test('should not return focus to another element if focus already manually returned', async ({
        page,
        skip,
      }, testInfo) => {
        skip.browser(
          'webkit',
          'WebKit does not consider buttons to be focusable, so this test always passes since the input is the only focusable element.'
        );
        testInfo.annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/28849',
        });
        await page.setContent(
          `
        <button id="open-action-sheet">open</button>
        <ion-action-sheet trigger="open-action-sheet"></ion-action-sheet>
        <input id="test-input" />

        <script>
          const actionSheet = document.querySelector('ion-action-sheet');

          actionSheet.addEventListener('ionActionSheetWillDismiss', () => {
            requestAnimationFrame(() => {
              document.querySelector('#test-input').focus();
            });
          });
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
        const input = page.locator(
          '#test-input'
        );
        const trigger = page.locator(
          '#open-action-sheet'
        );

        // present action sheet
        await trigger.click();
        await ionActionSheetDidPresent.next();

        // dismiss action sheet
        await actionSheet.evaluate(
          (
            el: HTMLIonActionSheetElement
          ) => el.dismiss()
        );

        // verify focus is in correct location
        await expect(
          input
        ).toBeFocused();
      });
    }
  );
});
