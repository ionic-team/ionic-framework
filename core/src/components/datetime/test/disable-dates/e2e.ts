import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

describe('datetime: disable dates', () => {

  describe('return values', () => {

    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage({
        html: '<ion-datetime value="2021-10-01"></ion-datetime>'
      });
    });


    describe('when isDateEnabled returns true', () => {

      it('calendar days should be enabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => true;
        });

        await page.waitForChanges();

        const disabledDays = await page.findAll('ion-datetime >>> .calendar-day[disabled]:not(.calendar-day-padding)');

        expect(disabledDays.length).toBe(0);
      });

    });

    describe('when isDateEnabled returns false', () => {

      it('calendar days should be disabled', async () => {

        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => false;
        });

        await page.waitForChanges();

        const disabledDays = await page.findAll('ion-datetime >>> .calendar-day[disabled]:not(.calendar-day-padding)');

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

        const enabledDays = await page.findAll('ion-datetime >>> .calendar-month:nth-child(2) .calendar-day:not([disabled]):not(.calendar-day-padding)');

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
        expect(errors[0]).toContain('Exception thrown in isDateEnabled function, ignoring');
      });

    });

    describe('when isDateEnabled returns undefined', () => {

      it('calendar days should be disabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => undefined;
        });

        await page.waitForChanges();

        const disabledDays = await page.findAll('ion-datetime >>> .calendar-day[disabled]:not(.calendar-day-padding)');

        expect(disabledDays.length).toBe(91);
      });

    });

    describe('when isDateEnabled returns null', () => {

      it('calendar days should be disabled', async () => {
        await page.$eval('ion-datetime', (el: any) => {
          el.isDateEnabled = () => null;
        });

        await page.waitForChanges();

        const disabledDays = await page.findAll('ion-datetime >>> .calendar-day[disabled]:not(.calendar-day-padding)');

        expect(disabledDays.length).toBe(91);
      });

    });

  });

  describe('examples', () => {

    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage({
        url: '/src/components/datetime/test/disable-dates?ionic:_testing=true'
      });
    });

    it('should disable a specific date', async () => {
      const disabledDay = await page.find('#specificDate >>> .calendar-day[disabled]:not(.calendar-day-padding)');

      expect(disabledDay.textContent).toBe('10');
    });

    it('should disable specific days of the week', async () => {
      const disabledDays = await page.findAll('#weekends >>> .calendar-month:nth-child(2) .calendar-day[disabled]:not(.calendar-day-padding)');
      const disabledValues = disabledDays.map(d => d.textContent);

      expect(disabledValues).toEqual(['2', '3', '9', '10', '16', '17', '23', '24', '30', '31']);
    });

    it('should disable a range of dates', async () => {
      const disabledDays = await page.findAll('#dateRange >>> .calendar-day[disabled]:not(.calendar-day-padding)');
      const disabledValues = disabledDays.map(d => d.textContent);

      expect(disabledValues).toEqual(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
    });

    it('should disable a month', async () => {
      const disabledDays = await page.findAll('#month >>> .calendar-day[disabled]:not(.calendar-day-padding)');
      const disabledValues = disabledDays.map(d => d.textContent);

      expect(disabledValues.length).toBe(31);
    });

  });

});
