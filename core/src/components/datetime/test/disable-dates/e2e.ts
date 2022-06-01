import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

describe('datetime: disable dates', () => {
  describe('return values', () => {
    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage({
        html: '<ion-datetime value="2021-10-01"></ion-datetime>',
      });
    });

    describe('when isDateEnabled throws an exception', () => {
      beforeEach(async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = (dateIsoString: string) => {
            const date = new Date(dateIsoString);

            if (date.getUTCDate() === 10 && date.getUTCMonth() === 9 && date.getUTCFullYear() === 2021) {
              // Throws an exception on October 10, 2021
              // Expected behavior: the day should be enabled
              throw new Error('Expected exception for e2e test.');
            }
            return false;
          };
        });
      });

      it('calendar days should be enabled', async () => {
        await page.waitForChanges();

        const enabledDays = await page.findAll(
          'ion-datetime >>> .calendar-month:nth-child(2) .calendar-day:not([disabled]):not(.calendar-day-padding)'
        );

        expect(enabledDays.length).toBe(1);
      });

      it('should throw an exception to the developer', async () => {
        const errors = [];

        page.on('console', (ev) => {
          if (ev.type() === 'error') {
            errors.push(ev.text());
          }
        });

        await page.waitForChanges();

        expect(errors.length).toBe(1);
        expect(errors[0]).toContain(
          '[Ionic Error]: Exception thrown from provided `isDateEnabled` function. Please check your function and try again.'
        );
      });
    });
  });
});
