import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

const DISABLED_CALENDAR_DAY_SELECTOR = '.calendar-day[disabled]:not(.calendar-day-padding)';

function queryDisabledDay(page: E2EPage, datetimeSelector = 'ion-datetime') {
  return page.find(`${datetimeSelector} >>> ${DISABLED_CALENDAR_DAY_SELECTOR}`);
}

function queryAllDisabledDays(page: E2EPage, datetimeSelector = 'ion-datetime') {
  return page.findAll(`${datetimeSelector} >>> ${DISABLED_CALENDAR_DAY_SELECTOR}`);
}

function queryAllWorkingMonthDisabledDays(page: E2EPage, datetimeSelector = 'ion-datetime') {
  return page.findAll(`${datetimeSelector} >>> .calendar-month:nth-child(2) ${DISABLED_CALENDAR_DAY_SELECTOR}`);
}

describe('datetime: disable dates', () => {
  describe('return values', () => {
    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage({
        html: '<ion-datetime value="2021-10-01"></ion-datetime>',
      });
    });

    describe('when isDateEnabled returns true', () => {
      it('calendar days should be enabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => true;
        });

        await page.waitForChanges();

        const disabledDays = await queryAllDisabledDays(page);

        expect(disabledDays.length).toBe(0);
      });
    });

    describe('when isDateEnabled returns false', () => {
      it('calendar days should be disabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => false;
        });

        await page.waitForChanges();

        const disabledDays = await queryAllDisabledDays(page);

        expect(disabledDays.length).toBe(91);
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

    describe('when isDateEnabled returns undefined', () => {
      it('calendar days should be disabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => undefined;
        });

        await page.waitForChanges();

        const disabledDays = await queryAllDisabledDays(page);

        expect(disabledDays.length).toBe(91);
      });
    });

    describe('when isDateEnabled returns null', () => {
      it('calendar days should be disabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => null;
        });

        await page.waitForChanges();

        const disabledDays = await queryAllDisabledDays(page);

        expect(disabledDays.length).toBe(91);
      });
    });
  });

  describe('examples', () => {
    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage({
        url: '/src/components/datetime/test/disable-dates?ionic:_testing=true',
      });
    });

    it('should disable a specific date', async () => {
      const disabledDay = await queryDisabledDay(page, '#specificDate');

      expect(disabledDay.textContent).toBe('10');
    });

    it('should disable specific days of the week', async () => {
      const disabledDays = await queryAllWorkingMonthDisabledDays(page, '#weekends');
      const disabledValues = disabledDays.map((d) => d.textContent);

      expect(disabledValues).toEqual(['2', '3', '9', '10', '16', '17', '23', '24', '30', '31']);
    });

    it('should disable a range of dates', async () => {
      const disabledDays = await queryAllDisabledDays(page, '#dateRange');
      const disabledValues = disabledDays.map((d) => d.textContent);

      expect(disabledValues).toEqual(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
    });

    it('should disable a month', async () => {
      const disabledDays = await queryAllDisabledDays(page, '#month');
      const disabledValues = disabledDays.map((d) => d.textContent);

      expect(disabledValues.length).toBe(31);
    });
  });

  describe('with a min date range', () => {
    it('should not enable already disabled dates', async () => {
      const page = await newE2EPage({
        html: `
          <ion-datetime min="2021-10-15" value="2021-10-16"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = () => true;
          </script>
        `,
      });

      const disabledDays = await queryAllWorkingMonthDisabledDays(page);

      expect(disabledDays.length).toBe(14);
    });
  });

  describe('with a max date range', () => {
    it('should not enable already disabled dates', async () => {
      const page = await newE2EPage({
        html: `
          <ion-datetime max="2021-10-15" value="2021-10-16"></ion-datetime>
          <script>
            const datetime = document.querySelector('ion-datetime');
            datetime.isDateEnabled = () => true;
          </script>
        `,
      });

      const disabledDays = await queryAllWorkingMonthDisabledDays(page);

      expect(disabledDays.length).toBe(16);
    });
  });
});
