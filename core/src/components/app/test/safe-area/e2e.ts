import { newE2EPage } from '@stencil/core/testing';

test('app: safe-area', async () => {

  const page = await newE2EPage({
    url: '/src/components/app/test/safe-area?ionic:_testing=true'
  });

  expect(await page.compareScreenshot()).toMatchScreenshot();

  // Action Sheet
  await page.click('#show-action-sheet');
  await page.waitForChanges();
  const actionSheet = await page.find('ion-action-sheet');
  expect(await page.compareScreenshot('action-sheet')).toMatchScreenshot();
  await actionSheet.callMethod('dismiss');

  // Menu
  await page.click('#show-menu');
  await page.waitForChanges();
  const menu = await page.find('ion-menu');
  expect(await page.compareScreenshot('menu')).toMatchScreenshot();
  await menu.callMethod('close');

  // Picker
  await page.click('#show-picker');
  await page.waitForChanges();
  const picker = await page.find('ion-picker');
  expect(await page.compareScreenshot('picker')).toMatchScreenshot();
  await picker.callMethod('dismiss');

  // Toast
  await page.click('#show-toast');
  await page.waitForChanges();
  const toast = await page.find('ion-toast');
  expect(await page.compareScreenshot('toast')).toMatchScreenshot();
  await toast.callMethod('dismiss');

});
