import { newE2EPage } from '@stencil/core/testing';

it('action-sheet: cssClass', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/custom-css?ionic:animated=false`
  });

  const presentBtn = await page.find('#cssClass');
  await presentBtn.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
