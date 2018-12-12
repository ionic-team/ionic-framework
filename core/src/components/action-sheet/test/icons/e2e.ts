import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: icons', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/icons?ionic:_testing=true`
  });

  const presentBtn = await page.find('#icons');
  await presentBtn.click();

  const actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
