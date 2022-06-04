import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

import { getElementProperty } from '../../../../utils/test/utils';
import { moveReorderItem } from '../test.utils';

it('reorder: custom scroll target', async () => {
  const page = await newE2EPage({
    url: '/src/components/reorder-group/test/scroll-target?ionic:_testing=true',
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

  compares.push(await page.compareScreenshot('reorder: interactive after move'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

const moveItem = async (
  id: string,
  page: E2EPage,
  direction: 'up' | 'down' = 'up',
  numberOfSpaces = 1,
  ...parentSelectors: string[]
) => {
  try {
    await moveReorderItem(`#${id}`, page, direction, numberOfSpaces, ...parentSelectors);
    await page.waitForTimeout(50);
  } catch (err) {
    throw err;
  }
};
