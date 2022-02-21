import { newE2EPage } from "@stencil/core/testing";

test('datetime: confirm date', async () => {

  const page = await newE2EPage({
    url: '/src/components/datetime/test/confirm-date?ionic:_testing=true'
  });

  const openModalBtn = await page.find('#open-modal');

  await openModalBtn.click();

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();
  await page.waitForTimeout(250);

  const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

  await buttons[1].click();

  await page.waitForTimeout(350);

  const confirmBtn = await page.find('#confirmBtn');

  await confirmBtn.click();

  await modal.waitForNotVisible();
  await page.waitForTimeout(250);

  const selectedValue = await page.find('#selectedValue');

  expect(selectedValue.textContent).toEqual('2021-11-22');

});
