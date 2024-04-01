import { expect } from '@playwright/test';
import {
  configs,
  test,
  Viewports,
} from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('modal: focus trapping'),
    () => {
      test.beforeEach(
        async ({ skip }) => {
          skip.browser(
            'firefox',
            'Firefox incorrectly allows keyboard focus to move to ion-content'
          );
        }
      );
      test('focus should be trapped inside of modal', async ({
        page,
        browserName,
      }) => {
        /**
         * The default WebKit behavior is to
         * highlight items on webpages with Option-Tab.
         * See "Press Tab to highlight each item on a webpage"
         * in Safari Preferences > Advanced.
         */
        const tabKey =
          browserName === 'webkit'
            ? 'Alt+Tab'
            : 'Tab';
        await page.goto(
          '/src/components/modal/test/basic',
          config
        );
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );

        await page.click(
          '#basic-modal'
        );

        await ionModalDidPresent.next();

        const dismissButton =
          page.locator(
            'ion-button.dismiss'
          );

        await page.keyboard.press(
          tabKey
        );
        await expect(
          dismissButton
        ).toBeFocused();

        await page.keyboard.press(
          `Shift+${tabKey}`
        );

        await expect(
          dismissButton
        ).toBeFocused();

        await page.keyboard.press(
          tabKey
        );
        await expect(
          dismissButton
        ).toBeFocused();
      });

      test('focus should be returned to previously focused element when dismissing modal', async ({
        page,
        browserName,
      }) => {
        await page.goto(
          '/src/components/modal/test/basic',
          config
        );
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );
        const modalButton =
          page.locator('#basic-modal');
        const tabKey =
          browserName === 'webkit'
            ? 'Alt+Tab'
            : 'Tab';

        // Focus #basic-modal button
        await page.keyboard.press(
          tabKey
        );
        await expect(
          modalButton
        ).toBeFocused();

        await page.keyboard.press(
          'Space'
        );
        await ionModalDidPresent.next();

        await page.keyboard.press(
          'Escape'
        );
        await ionModalDidDismiss.next();

        await expect(
          modalButton
        ).toBeFocused();
      });
    }
  );
});

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('modal: rendering'),
      () => {
        const runVisualTests = async (
          page: E2EPage,
          screenshotModifier = ''
        ) => {
          await page.goto(
            '/src/components/modal/test/basic',
            config
          );

          const ionModalWillDismiss =
            await page.spyOnEvent(
              'ionModalWillDismiss'
            );
          const ionModalDidDismiss =
            await page.spyOnEvent(
              'ionModalDidDismiss'
            );
          const ionModalWillPresent =
            await page.spyOnEvent(
              'ionModalWillPresent'
            );
          const ionModalDidPresent =
            await page.spyOnEvent(
              'ionModalDidPresent'
            );

          await page.click(
            '#basic-modal'
          );

          await ionModalWillPresent.next();
          await ionModalDidPresent.next();

          const modal = page.locator(
            'ion-modal'
          );
          await expect(
            modal
          ).toHaveClass(/show-modal/);

          await page.setIonViewport();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `modal-basic-present${screenshotModifier}`
            )
          );

          await modal.evaluate(
            (
              el: HTMLIonModalElement
            ) => {
              el.dismiss();
            }
          );

          await ionModalWillDismiss.next();
          await ionModalDidDismiss.next();

          await expect(
            modal
          ).not.toHaveClass(
            /show-modal/
          );
          await expect(
            modal
          ).toBeHidden();
        };

        test('should not have visual regressions', async ({
          page,
        }) => {
          await runVisualTests(page);
        });
        test('should not have visual regressions with tablet viewport', async ({
          page,
        }) => {
          await page.setViewportSize(
            Viewports.tablet.portrait
          );
          await runVisualTests(
            page,
            '-tablet'
          );
        });
      }
    );
  }
);

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('modal: backdrop'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/modal/test/basic',
            config
          );
        }
      );

      test('it should dismiss the modal when clicking the backdrop', async ({
        page,
      }) => {
        await page.setViewportSize(
          Viewports.tablet.portrait
        );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        await page.click(
          '#basic-modal'
        );
        await ionModalDidPresent.next();

        await page.mouse.click(20, 20);
        await ionModalDidDismiss.next();
      });
    }
  );
  test.describe(
    title('modal: incorrect usage'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/modal/test/basic',
            config
          );
        }
      );

      test('it should warn when setting a breakpoint on a non-sheet modal', async ({
        page,
      }) => {
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );

        const warnings: string[] = [];

        page.on('console', (ev) => {
          if (ev.type() === 'warning') {
            warnings.push(ev.text());
          }
        });

        await page.click(
          '#basic-modal'
        );
        await ionModalDidPresent.next();

        const modal = page.locator(
          'ion-modal'
        );
        await modal.evaluate(
          (el: HTMLIonModalElement) =>
            el.setCurrentBreakpoint(0.5)
        );

        expect(warnings.length).toBe(1);
        expect(warnings[0]).toBe(
          '[Ionic Warning]: setCurrentBreakpoint is only supported on sheet modals.'
        );
      });

      test('it should return undefined when getting the breakpoint on a non-sheet modal', async ({
        page,
      }) => {
        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );

        await page.click(
          '#basic-modal'
        );
        await ionModalDidPresent.next();

        const modal = page.locator(
          'ion-modal'
        );
        const breakpoint =
          await modal.evaluate(
            (
              el: HTMLIonModalElement
            ) => {
              return el.getCurrentBreakpoint();
            }
          );

        expect(breakpoint).toBe(
          undefined
        );
      });
    }
  );
});
