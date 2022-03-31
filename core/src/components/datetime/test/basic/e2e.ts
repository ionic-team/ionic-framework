import { newE2EPage } from '@stencil/core/testing';

describe('Footer', () => {
  test('should render default buttons', async () => {
    const page = await newE2EPage({
      html: '<ion-datetime show-default-buttons="true"></ion-datetime>'
    });

    const cancelButton = await page.find('ion-datetime >>> #cancel-button');
    expect(cancelButton).toEqualText('Cancel');

    const confirmButton = await page.find('ion-datetime >>> #confirm-button');
    expect(confirmButton).toEqualText('Done');

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render clear button', async () => {
    const page = await newE2EPage({
      html: '<ion-datetime show-clear-button="true"></ion-datetime>'
    });

    const clearButton = await page.find('ion-datetime >>> #clear-button');
    expect(clearButton).toEqualText('Clear');

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render clear and default buttons', async () => {
    const page = await newE2EPage({
      html: '<ion-datetime show-default-buttons="true" show-clear-button="true"></ion-datetime>'
    });

    const cancelButton = await page.find('ion-datetime >>> #cancel-button');
    expect(cancelButton).toEqualText('Cancel');

    const confirmButton = await page.find('ion-datetime >>> #confirm-button');
    expect(confirmButton).toEqualText('Done');

    const clearButton = await page.find('ion-datetime >>> #clear-button');
    expect(clearButton).toEqualText('Clear');

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render custom buttons', async () => {
    const page = await newE2EPage({
      html: `
        <ion-datetime show-default-buttons="true" show-clear-button="true">
          <ion-buttons slot="buttons">
            <ion-button id="custom-button">Hello!</ion-button>
          </ion-buttons>
        </ion-datetime>
      `
    });

    const customButton = await page.find('ion-datetime #custom-button');
    expect(customButton).not.toBeNull();

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render custom buttons', async () => {
    const page = await newE2EPage({
      html: `
        <ion-datetime show-default-buttons="true" show-clear-button="true">
          <ion-buttons slot="buttons">
            <ion-button id="custom-button">Hello!</ion-button>
          </ion-buttons>
        </ion-datetime>
      `
    });

    const customButton = await page.find('ion-datetime #custom-button');
    expect(customButton).not.toBeNull();

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });
});

describe('datetime: selecting a day', () => {

  it('should update the active day', async () => {
    const page = await newE2EPage({
      html: `
        <ion-datetime show-default-buttons="true" value="2021-12-25T12:40:00.000Z"></ion-datetime>
      `
    });

    const activeDay = await page.find('ion-datetime >>> .calendar-day-active');

    expect(activeDay.innerText).toEqual('25');

    const dayBtn = await page.find('ion-datetime >>> .calendar-day[data-day="13"][data-month="12"]');
    dayBtn.click();
    await page.waitForChanges();

    const newActiveDay = await page.find('ion-datetime >>> .calendar-day-active');

    expect(newActiveDay.innerText).toEqual('13');
  });

});

test('datetime:rtl: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

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
      `
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
