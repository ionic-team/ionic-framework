import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('input: clearOnEdit'),
    () => {
      test('should clear the input on first keystroke of input being focused', async ({
        page,
      }) => {
        await page.setContent(
          `<ion-input value="some value" clear-on-edit="true"></ion-input>`,
          config
        );

        const input = page.locator(
          'ion-input'
        );

        await input.click();
        await input.type('h');

        expect(
          await input.evaluate(
            (el: HTMLIonInputElement) =>
              el.value
          )
        ).toBe('h');

        await input.type('ello world');

        expect(
          await input.evaluate(
            (el: HTMLIonInputElement) =>
              el.value
          )
        ).toBe('hello world');
      });

      test('should not clear the input when pressing Enter', async ({
        page,
      }) => {
        await page.setContent(
          `<ion-input value="some value" clear-on-edit="true"></ion-input>`,
          config
        );

        const input = page.locator(
          'ion-input'
        );

        await input.click();
        await page.keyboard.press(
          'Enter'
        );

        expect(
          await input.evaluate(
            (el: HTMLIonInputElement) =>
              el.value
          )
        ).toBe('some value');
      });

      test('should not clear the input if it does not have an initial value when typing', async ({
        page,
      }) => {
        await page.setContent(
          `<ion-input value="" clear-on-edit="true"></ion-input>`,
          config
        );

        const input = page.locator(
          'ion-input'
        );

        await input.click();
        await input.type('hello world');

        expect(
          await input.evaluate(
            (el: HTMLIonInputElement) =>
              el.value
          )
        ).toBe('hello world');
      });

      test('should emit ionChange once on blur', async ({
        page,
      }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description:
            'https://ionic-cloud.atlassian.net/browse/FW-2315',
        });

        await page.setContent(
          `<ion-input placeholder="input" clear-on-edit="true"></ion-input>`,
          config
        );

        const ionChangeSpy =
          await page.spyOnEvent(
            'ionChange'
          );
        const ionInputSpy =
          await page.spyOnEvent(
            'ionInput'
          );

        const input = page.locator(
          'ion-input'
        );
        const nativeInput =
          input.locator('input');

        await nativeInput.type('123', {
          delay: 100,
        });

        expect(
          ionInputSpy
        ).toHaveReceivedEventTimes(3);

        await nativeInput.evaluate(
          (el: HTMLInputElement) =>
            el.blur()
        );

        expect(
          ionChangeSpy
        ).toHaveReceivedEventTimes(1);

        await nativeInput.type('a');

        expect(
          await input.evaluate(
            (el: HTMLIonInputElement) =>
              el.value
          )
        ).toBe('a');

        await nativeInput.evaluate(
          (el: HTMLInputElement) =>
            el.blur()
        );

        expect(
          ionInputSpy
        ).toHaveReceivedEventTimes(5);
        expect(
          ionChangeSpy
        ).toHaveReceivedEventTimes(2);
      });
    }
  );
});
