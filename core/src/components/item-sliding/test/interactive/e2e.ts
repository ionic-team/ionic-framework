import { newE2EPage } from '@stencil/core/testing';

import { openItemSliding } from '../test.utils';

test('item-sliding: interactive', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/interactive?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  const items = await page.$$('ion-item-sliding');
  expect(items.length).toEqual(3);

  await slideAndDelete(items[0], page);

  const itemsAfterFirstSlide = await page.$$('ion-item-sliding');
  expect(itemsAfterFirstSlide.length).toEqual(2);

  await slideAndDelete(items[1], page);

  const itemsAfterSecondSlide = await page.$$('ion-item-sliding');
  expect(itemsAfterSecondSlide.length).toEqual(1);

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

const slideAndDelete = async (item: any, page: any) => {
  try {
    // Get the element's ID
    const id = await(await item.getProperty('id')).jsonValue();
    await openItemSliding(`#${id}`, page);
    await deleteItemSliding(item, page, id);
  } catch (err) {
    throw err;
  }
};

const deleteItemSliding = async (item: any, page: any, id: string) => {
  // Click the "delete" option
  const options = await item.$$('ion-item-option');
  await options[0].click();

  // Wait for element to be removed from DOM
  await page.waitForSelector(id, { hidden: true });

  await page.waitFor(1000);
};
