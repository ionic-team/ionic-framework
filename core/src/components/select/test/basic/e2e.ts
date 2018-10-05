import { newE2EPage } from '@stencil/core/testing';

it('select: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/basic?ionic:animated=false'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  let select = await page.find('#gender');
  await select.click();

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();

  compare = await page.compareScreenshot('should open gender single select');
  expect(compare).toMatchScreenshot();

  select = await page.find('#customSelect');
  await select.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  compare = await page.compareScreenshot('should open custom action sheet select');
  expect(compare).toMatchScreenshot();
});
