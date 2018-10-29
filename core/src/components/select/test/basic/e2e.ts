import { newE2EPage } from '@stencil/core/testing';

it('select: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/basic?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  let select = await page.find('#gender');
  await select.click();

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('should open gender single select');
  expect(compare).toMatchScreenshot();

  await alert.callMethod('dismiss');

  select = await page.find('#customSelect');
  await select.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('should open custom action sheet select');
  expect(compare).toMatchScreenshot();
});
