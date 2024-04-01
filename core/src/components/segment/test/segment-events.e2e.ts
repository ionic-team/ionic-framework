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
    title('segment: events: ionChange'),
    () => {
      test.describe(
        'when the segment is activated by keyboard navigation',
        () => {
          test('should emit when there is no initial value', async ({
            page,
            browserName,
          }) => {
            await page.setContent(
              `
          <ion-segment>
            <ion-segment-button value="1">
              <ion-label>One</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2">
              <ion-label>Two</ion-label>
            </ion-segment-button>
            <ion-segment-button value="3">
              <ion-label>Three</ion-label>
            </ion-segment-button>
          </ion-segment>
      `,
              config
            );

            const segment =
              page.locator(
                'ion-segment'
              );
            const ionChangeSpy =
              await page.spyOnEvent(
                'ionChange'
              );

            const tabKey =
              browserName === 'webkit'
                ? 'Alt+Tab'
                : 'Tab';

            await page.keyboard.press(
              tabKey
            );
            await page.keyboard.press(
              'ArrowRight'
            );
            await page.keyboard.press(
              'Enter'
            );

            expect(
              await segment.evaluate(
                (
                  el: HTMLIonSegmentElement
                ) => el.value
              )
            ).toBe('2');

            expect(
              ionChangeSpy
            ).toHaveReceivedEventTimes(
              1
            );
            expect(
              ionChangeSpy
            ).toHaveReceivedEventDetail(
              { value: '2' }
            );
          });
        }
      );

      test.describe(
        'when the segment is clicked',
        () => {
          test('should emit when the value changes', async ({
            page,
          }) => {
            await page.setContent(
              `
            <ion-segment value="1">
              <ion-segment-button value="1">
                <ion-label>One</ion-label>
              </ion-segment-button>
              <ion-segment-button value="2">
                <ion-label>Two</ion-label>
              </ion-segment-button>
              <ion-segment-button value="3">
                <ion-label>Three</ion-label>
              </ion-segment-button>
            </ion-segment>
          `,
              config
            );

            const segment =
              page.locator(
                'ion-segment'
              );
            const ionChangeSpy =
              await page.spyOnEvent(
                'ionChange'
              );

            await page.click(
              'ion-segment-button[value="2"]'
            );

            await ionChangeSpy.next();

            expect(
              await segment.evaluate(
                (
                  el: HTMLIonSegmentElement
                ) => el.value
              )
            ).toBe('2');

            expect(
              ionChangeSpy
            ).toHaveReceivedEventDetail(
              { value: '2' }
            );
            expect(
              ionChangeSpy
            ).toHaveReceivedEventTimes(
              1
            );
          });

          test('when the segment does not have an initial value', async ({
            page,
          }) => {
            await page.setContent(
              `
            <ion-segment>
              <ion-segment-button value="1">
                <ion-label>One</ion-label>
              </ion-segment-button>
              <ion-segment-button value="2">
                <ion-label>Two</ion-label>
              </ion-segment-button>
              <ion-segment-button value="3">
                <ion-label>Three</ion-label>
              </ion-segment-button>
            </ion-segment>
          `,
              config
            );

            const segment =
              page.locator(
                'ion-segment'
              );
            const ionChangeSpy =
              await page.spyOnEvent(
                'ionChange'
              );

            await page.click(
              'ion-segment-button[value="2"]'
            );

            await ionChangeSpy.next();

            expect(
              await segment.evaluate(
                (
                  el: HTMLIonSegmentElement
                ) => el.value
              )
            ).toBe('2');

            expect(
              ionChangeSpy
            ).toHaveReceivedEventDetail(
              { value: '2' }
            );
            expect(
              ionChangeSpy
            ).toHaveReceivedEventTimes(
              1
            );
          });
        }
      );

      // TODO FW-3021
      test.describe.skip(
        'when the pointer is released',
        () => {
          test('should emit if the value has changed', async ({
            page,
          }) => {
            test
              .info()
              .annotations.push({
                type: 'issue',
                description:
                  'https://github.com/ionic-team/ionic-framework/issues/20257',
              });

            await page.setContent(
              `
          <ion-app>
            <ion-toolbar>
              <ion-segment value="1">
                <ion-segment-button value="1">
                  <ion-label>One</ion-label>
                </ion-segment-button>
                <ion-segment-button value="2">
                  <ion-label>Two</ion-label>
                </ion-segment-button>
                <ion-segment-button value="3">
                  <ion-label>Three</ion-label>
                </ion-segment-button>
              </ion-segment>
            </ion-toolbar>
          </ion-app>
        `,
              config
            );

            const ionChangeSpy =
              await page.spyOnEvent(
                'ionChange'
              );

            const firstButton =
              page.locator(
                'ion-segment-button[value="1"]'
              );
            const lastButton =
              page.locator(
                'ion-segment-button[value="3"]'
              );

            await firstButton.hover();
            await page.mouse.down();

            await lastButton.hover();
            await page.mouse.up();

            expect(
              ionChangeSpy
            ).toHaveReceivedEventDetail(
              { value: '3' }
            );
            expect(
              ionChangeSpy
            ).toHaveReceivedEventTimes(
              1
            );
          });

          test('should not emit if the value has not changed', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-segment value="1">
            <ion-segment-button value="1">
              <ion-label>One</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2">
              <ion-label>Two</ion-label>
            </ion-segment-button>
            <ion-segment-button value="3">
              <ion-label>Three</ion-label>
            </ion-segment-button>
          </ion-segment>
        `,
              config
            );

            const ionChangeSpy =
              await page.spyOnEvent(
                'ionChange'
              );

            const firstButton =
              page.locator(
                'ion-segment-button[value="1"]'
              );
            const lastButton =
              page.locator(
                'ion-segment-button[value="3"]'
              );

            await firstButton.hover();
            await page.mouse.down();

            await lastButton.hover();

            await firstButton.hover();
            await page.mouse.up();

            expect(
              ionChangeSpy
            ).toHaveReceivedEventTimes(
              0
            );
          });
        }
      );

      test('should not emit if the value has not changed on click', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-segment value="1">
          <ion-segment-button value="1">
            <ion-label>One</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2">
            <ion-label>Two</ion-label>
          </ion-segment-button>
          <ion-segment-button value="3">
            <ion-label>Three</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
          config
        );

        const segment = page.locator(
          'ion-segment'
        );
        const ionChangeSpy =
          await page.spyOnEvent(
            'ionChange'
          );

        await page.click(
          'ion-segment-button[value="1"]'
        );

        expect(
          await segment.evaluate(
            (
              el: HTMLIonSegmentElement
            ) => el.value
          )
        ).toBe('1');

        expect(
          ionChangeSpy
        ).toHaveReceivedEventTimes(0);
      });

      test('should not emit if the value is set programmatically', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-segment value="1">
          <ion-segment-button value="1">
            <ion-label>One</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2">
            <ion-label>Two</ion-label>
          </ion-segment-button>
          <ion-segment-button value="3">
            <ion-label>Three</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
          config
        );

        const segment = page.locator(
          'ion-segment'
        );
        const ionChangeSpy =
          await page.spyOnEvent(
            'ionChange'
          );

        await segment.evaluate(
          (el: HTMLIonSegmentElement) =>
            (el.value = '2')
        );

        expect(
          ionChangeSpy
        ).toHaveReceivedEventTimes(0);
        expect(
          await segment.evaluate(
            (
              el: HTMLIonSegmentElement
            ) => el.value
          )
        ).toBe('2');
      });

      test('should emit when clicking after changing value programmatically', async ({
        page,
      }) => {
        test.info().annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/27002',
        });

        await page.setContent(
          `
        <ion-segment value="1" swipe-gesture="false">
          <ion-segment-button value="1">
            <ion-label>One</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2">
            <ion-label>Two</ion-label>
          </ion-segment-button>
          <ion-segment-button value="3">
            <ion-label>Three</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
          config
        );

        const segment = page.locator(
          'ion-segment'
        );
        const segmentButtons =
          segment.locator(
            'ion-segment-button'
          );
        const ionChangeSpy =
          await page.spyOnEvent(
            'ionChange'
          );

        await segment.evaluate(
          (el: HTMLIonSegmentElement) =>
            (el.value = '2')
        );

        await segmentButtons
          .nth(0)
          .click();

        await ionChangeSpy.next();
        expect(
          ionChangeSpy
        ).toHaveReceivedEventDetail({
          value: '1',
        });
      });
    }
  );
});
