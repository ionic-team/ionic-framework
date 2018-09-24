import { newE2EPage } from '@stencil/core/testing';

it('action-sheet: scrollWithoutCancel', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/scroll-without-cancel?ionic:animated=false`
  });

  const presentBtn = await page.find('#scrollWithoutCancel');
  await presentBtn.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
