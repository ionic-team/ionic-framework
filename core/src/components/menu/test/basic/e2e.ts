import { newE2EPage } from '@stencil/core/testing';

import { testMenu } from '../test.utils';

const DIRECTORY = 'basic';
const getActiveElementID = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate((el) => el?.id, activeElement);
};

test('menu: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/menu/test/basic?ionic:_testing=true' });

  await page.click('#open-first');
  const menu = await page.find('#start-menu');
  await menu.waitForVisible();

  let activeElID = await getActiveElementID(page);
  expect(activeElID).toEqual('start-menu');

  await page.keyboard.press('Tab');
  activeElID = await getActiveElementID(page);
  expect(activeElID).toEqual('start-menu-button');

  // do it again to make sure focus stays inside menu
  await page.keyboard.press('Tab');
  activeElID = await getActiveElementID(page);
  expect(activeElID).toEqual('start-menu-button');
});

test('menu: preserve scroll position', async () => {
  const page = await newE2EPage({ url: '/src/components/menu/test/basic?ionic:_testing=true' });

  await page.click('#open-first');
  const menu = await page.find('#start-menu');
  await menu.waitForVisible();

  await page.$eval('#start-menu ion-content', (menuContentEl: any) => {
    return menuContentEl.scrollToPoint(0, 200);
  });

  await menu.callMethod('close');

  await page.click('#open-first');
  await menu.waitForVisible();

  const scrollTop = await page.$eval('#start-menu ion-content', async (menuContentEl: any) => {
    const contentScrollEl = await menuContentEl.getScrollElement();
    return contentScrollEl.scrollTop;
  });

  expect(scrollTop).toEqual(200);
});
