import { newE2EPage } from '@stencil/core/testing';

it('action-sheet: alertFromActionSheet', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/alert-from-action-sheet?ionic:_testing=true`
  });

  const presentBtn = await page.find('#alertFromActionSheet');
  await presentBtn.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const openAlertBtn = await page.find({ text: 'Open Alert' });
  await openAlertBtn.click();

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot(`alert open`);
  expect(compare).toMatchScreenshot();

  const alertOkayBtn = await page.find({ contains: 'Okay' });
  await alertOkayBtn.click();
});
