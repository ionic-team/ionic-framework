import { newE2EPage } from '@stencil/core/testing';

const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate((el) => el?.textContent, activeElement);
};

test('action-sheet: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/action-sheet/test/basic?ionic:_testing=true' });

  await page.click('#basic');
  await page.waitForSelector('#basic');

  const actionSheet = await page.find('ion-action-sheet');

  expect(actionSheet).not.toBe(null);
  await actionSheet.waitForVisible();

  await page.keyboard.press('Tab');

  const activeElementText = await getActiveElementText(page);
  expect(activeElementText).toEqual('Delete');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const activeElementTextTwo = await getActiveElementText(page);
  expect(activeElementTextTwo).toEqual('Cancel');

  await page.keyboard.press('Tab');

  const activeElementTextThree = await getActiveElementText(page);
  expect(activeElementTextThree).toEqual('Delete');
});

