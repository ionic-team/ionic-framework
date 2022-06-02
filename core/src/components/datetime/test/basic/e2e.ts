import { newE2EPage } from '@stencil/core/testing';

describe('datetime: confirm date', () => {
  test('should set the date value based on the selected date', async () => {
    const page = await newE2EPage({
      html: `
        <button>Bind datetimeMonthDidChange event</button>
        <ion-datetime value="2021-12-25T12:40:00.000Z"></ion-datetime>
        <script type="module">
          import { InitMonthDidChangeEvent } from '/src/components/datetime/test/utils/month-did-change-event.js';
          document.querySelector('button').addEventListener('click', function() {
            InitMonthDidChangeEvent();
          });
        </script>
      `,
    });

    const eventButton = await page.find('button');
    await eventButton.click();

    const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button');

    await buttons[1].click();

    await page.waitForEvent('datetimeMonthDidChange');

    await page.$eval('ion-datetime', async (el: any) => {
      await el.confirm();
    });

    const value = await (await page.find('ion-datetime')).getProperty('value');

    expect(value).toMatch('2021-12-25T12:40:00');
  });
});
