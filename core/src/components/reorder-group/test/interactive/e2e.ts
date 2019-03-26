import * as pd from '@stencil/core/dist/testing/puppeteer/puppeteer-declarations';
import { newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';

import { queryDeep } from '../../../../utils/test/utils';
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

  const shadowDomList = await queryDeep(page, 'test-reorder-list-shadow-dom', 'ion-list');

  const itemsInShadowRoot = await shadowDomList.$$('ion-reorder');
  expect(await getItemId(itemsInShadowRoot[0])).toEqual('item-0');

  await moveItem(itemsInShadowRoot[0], page, 'down', 1, 'test-reorder-list-shadow-dom', 'ion-list');

  const itemsInShadowRootAfterFirstMove = await shadowDomList.$$('ion-reorder');
  expect(await getItemId(itemsInShadowRootAfterFirstMove[0])).toEqual('item-1');

  await moveItem(itemsInShadowRoot[0], page, 'up', 1, 'test-reorder-list-shadow-dom', 'ion-list');

  const itemsInShadowRootAfterSecondMove = await shadowDomList.$$('ion-reorder');
  expect(await getItemId(itemsInShadowRootAfterSecondMove[0])).toEqual('item-0');

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

async function getItemId(item: ElementHandle) {
  return (await item.getProperty('id')).jsonValue();
}

async function moveItem(item: ElementHandle, page: pd.E2EPage, direction: 'up' | 'down' = 'up', numberOfSpaces = 1, ...parentSelectors: string[]) {
  try {
    // Get the element's ID
    const id = await getItemId(item);
    await moveReorderItem(`#${id}`, page, direction, numberOfSpaces, ...parentSelectors);
  } catch (err) {
    throw err;
  }
}
