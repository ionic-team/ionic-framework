import * as pd from '@stencil/core/dist/testing/puppeteer/puppeteer-declarations';
import { newE2EPage } from '@stencil/core/testing';

import { getElementProperty, queryDeep } from '../../../../utils/test/utils';
import { moveReorderItem } from '../test.utils';

test('reorder: interactive', async () => {
  const page = await newE2EPage({
    url: '/src/components/reorder-group/test/interactive?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot('reorder: interactive before move'));

  const items = await page.$$('ion-reorder');
  const getItemId = await getElementProperty(items[0], 'id');
  expect(getItemId).toEqual('item-0');

  await moveItem(getItemId, page, 'down', 1);

  const itemsAfterFirstMove = await page.$$('ion-reorder');
  expect(await getElementProperty(itemsAfterFirstMove[0], 'id')).toEqual('item-1');

  await moveItem(getItemId, page, 'up', 1);

  const itemsAfterSecondMove = await page.$$('ion-reorder');
  expect(await getElementProperty(itemsAfterSecondMove[0], 'id')).toEqual('item-0');

  compares.push(await page.compareScreenshot('reorder: interactive after move; before shadow move'));

  const shadowDomList = await queryDeep(page, 'test-reorder-list-shadow-dom', 'ion-list');

  const itemsInShadowRoot = await shadowDomList.$$('ion-reorder');
  const getShadowItemId = await getElementProperty(itemsInShadowRoot[0], 'id');
  expect(getShadowItemId).toEqual('item-0');

  await moveItem(getShadowItemId, page, 'down', 1, 'test-reorder-list-shadow-dom', 'ion-list');

  const itemsInShadowRootAfterFirstMove = await shadowDomList.$$('ion-reorder');
  expect(await getElementProperty(itemsInShadowRootAfterFirstMove[0], 'id')).toEqual('item-1');

  await moveItem(getShadowItemId, page, 'up', 1, 'test-reorder-list-shadow-dom', 'ion-list');

  const itemsInShadowRootAfterSecondMove = await shadowDomList.$$('ion-reorder');
  expect(await getElementProperty(itemsInShadowRootAfterSecondMove[0], 'id')).toEqual('item-0');

  compares.push(await page.compareScreenshot('reorder: interactive after shadow move'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

const moveItem = async (id: string, page: pd.E2EPage, direction: 'up' | 'down' = 'up', numberOfSpaces = 1, ...parentSelectors: string[]) => {
  try {
    await moveReorderItem(`#${id}`, page, direction, numberOfSpaces, ...parentSelectors);
    await page.waitFor(50);
  } catch (err) {
    throw err;
  }
};
