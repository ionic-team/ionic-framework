import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: noBackdropDismiss', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/no-backdrop-dismiss?ionic:_testing=true`
  });

  const presentBtn = await page.find('#noBackdropDismiss');
  await presentBtn.click();

  let actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const backdrop = await page.find('ion-backdrop');
  await backdrop.click();

  compare = await page.compareScreenshot(`dismissed`);
  expect(compare).toMatchScreenshot();

  const isVisible = await actionSheet.isVisible();
  expect(isVisible).toBe(true);

  const cancel = await page.find('.action-sheet-cancel');
  await cancel.click();

  await actionSheet.waitForNotVisible();

  actionSheet = await page.find('ion-action-sheet');
  expect(actionSheet).toBe(null);
});
