import { expect } from '@playwright/test';
import {
  test,
  configs,
} from '@utils/test/playwright';

const IGNORED_KEYS = [
  'Tab',
  'Shift',
  'Meta',
  'Alt',
  'Control',
];

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('textarea: clearOnEdit'),
    () => {
      test('should clear when typed into', async ({
        page,
      }) => {
        await page.setContent(
          `<ion-textarea value="abc" clear-on-edit="true" aria-label="textarea"></ion-textarea>`,
          config
        );

        const ionInput =
          await page.spyOnEvent(
            'ionInput'
          );

        const textarea = page.locator(
          'ion-textarea'
        );
        await textarea
          .locator('textarea')
          .type('h');

        await ionInput.next();

        await expect(
          textarea
        ).toHaveJSProperty(
          'value',
          'h'
        );
      });

      test('should not clear when tab is pressed', async ({
        page,
      }) => {
        await page.setContent(
          `<ion-textarea value="abc" clear-on-edit="true" aria-label="textarea"></ion-textarea>`,
          config
        );

        const textarea = page.locator(
          'ion-textarea'
        );
        await textarea
          .locator('textarea')
          .focus();

        await page.keyboard.press(
          'Tab'
        );
        await page.waitForChanges();

        await expect(
          textarea
        ).toHaveJSProperty(
          'value',
          'abc'
        );
      });

      test('should not clear the textarea if it does not have an initial value when typing', async ({
        page,
      }) => {
        await page.setContent(
          `<ion-textarea label="textarea" value="" clear-on-edit="true"></ion-textarea>`,
          config
        );

        const textarea = page.locator(
          'ion-textarea'
        );

        await textarea.click();
        await textarea.type(
          'hello world'
        );

        await expect(
          textarea
        ).toHaveJSProperty(
          'value',
          'hello world'
        );
      });

      IGNORED_KEYS.forEach(
        (ignoredKey: string) => {
          test(`should not clear when ${ignoredKey} is pressed`, async ({
            page,
            skip,
          }) => {
            skip.browser(
              (browserName: string) =>
                browserName ===
                  'firefox' &&
                ignoredKey === 'Meta',
              'Firefox incorrectly adds "OS" to the textarea when pressing the Meta key on Linux'
            );
            await page.setContent(
              `<ion-textarea value="abc" clear-on-edit="true" aria-label="textarea"></ion-textarea>`,
              config
            );

            const textarea =
              page.locator(
                'ion-textarea'
              );
            await textarea
              .locator('textarea')
              .focus();

            await page.keyboard.press(
              ignoredKey
            );
            await page.waitForChanges();

            await expect(
              textarea
            ).toHaveJSProperty(
              'value',
              'abc'
            );
          });
        }
      );

      test('should clear after when pressing valid key after pressing ignored key', async ({
        page,
      }) => {
        test.info().annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/28633',
        });

        await page.setContent(
          `<ion-textarea value="abc" clear-on-edit="true" aria-label="textarea"></ion-textarea>`,
          config
        );

        const textarea = page.locator(
          'ion-textarea'
        );
        await textarea
          .locator('textarea')
          .focus();

        // ignored
        await page.keyboard.press(
          'Shift'
        );
        await page.waitForChanges();

        await expect(
          textarea
        ).toHaveJSProperty(
          'value',
          'abc'
        );

        // allowed
        await page.keyboard.press('a');
        await page.waitForChanges();

        await expect(
          textarea
        ).toHaveJSProperty(
          'value',
          'a'
        );
      });
    }
  );
});
