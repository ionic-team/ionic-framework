import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: basic', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/basic?ionic:_testing=true`
  });

  const presentBtn = await page.find('#basic');
  await presentBtn.click();

  let actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  await actionSheet.callMethod('dismiss');

  await actionSheet.waitForNotVisible();

  compare = await page.compareScreenshot(`dismissed`);
  expect(compare).toMatchScreenshot();

  actionSheet = await page.find('ion-action-sheet');

  expect(actionSheet).toBe(null);
});
