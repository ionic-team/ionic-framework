import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: spec', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/spec?ionic:_testing=true`
  });

  const presentBtn = await page.find('#spec');
  await presentBtn.click();

  let actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();

  const compares = [];
  compares.push(await page.compareScreenshot());

  await actionSheet.callMethod('dismiss');
  await actionSheet.waitForNotVisible();

  compares.push(await page.compareScreenshot(`dismissed`));

  actionSheet = await page.find('ion-action-sheet');
  expect(actionSheet).toBe(null);

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
