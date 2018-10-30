import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: cssClass', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/custom-css?ionic:_testing=true`
  });

  const presentBtn = await page.find('#cssClass');
  await presentBtn.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
