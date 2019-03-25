import { newE2EPage } from '@stencil/core/testing';

import { moveReorderItem } from '../test.utils';

test('reorder: interactive', async () => {
  const page = await newE2EPage({
    url: '/src/components/reorder-group/test/interactive?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  const items = await page.$$('ion-reorder');
  expect(await getItemId(items[0])).toEqual('item-0');

  await moveItem(items[0], page, 'down', 1);

  const itemsAfterFirstMove = await page.$$('ion-reorder');
  expect(await getItemId(itemsAfterFirstMove[0])).toEqual('item-1');

  await moveItem(items[0], page, 'up', 1);

  const itemsAfterSecondMove = await page.$$('ion-reorder');
  expect(await getItemId(itemsAfterSecondMove[0])).toEqual('item-0');

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

async function getItemId(item: any) {
  return (await item.getProperty('id')).jsonValue();
}

async function moveItem(item: any, page: any, direction: 'up' | 'down' = 'up', numberOfSpaces = 1) {
  try {
    // Get the element's ID
    const id = await getItemId(item);
    await moveReorderItem(`#${id}`, page, direction, numberOfSpaces);
  } catch (err) {
    throw err;
  }
}
