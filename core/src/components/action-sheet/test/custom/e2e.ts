import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: custom', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/custom?ionic:_testing=true`
  });

  const presentBtn = await page.find('#custom');
  await presentBtn.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
