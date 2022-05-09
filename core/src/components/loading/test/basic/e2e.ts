import { newE2EPage } from '@stencil/core/testing';

import { testLoading } from '../test.utils';

const DIRECTORY = 'basic';
const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate((el) => el?.textContent, activeElement);
};

test('loading: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/loading/test/basic?ionic:_testing=true' });

  await page.click('#html-content-loading');
  await page.waitForSelector('#html-content-loading');

  const loading = await page.find('ion-loading');

  expect(loading).not.toBe(null);
  await loading.waitForVisible();

  await page.keyboard.press('Tab');

  const activeElementText = await getActiveElementText(page);
  expect(activeElementText).toEqual('Click impatiently to load faster');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const activeElementTextTwo = await getActiveElementText(page);
  expect(activeElementTextTwo).toEqual('Click impatiently to load faster');

  await page.keyboard.press('Tab');

  const activeElementTextThree = await getActiveElementText(page);
  expect(activeElementTextThree).toEqual('Click impatiently to load faster');
});

test('loading: backdrop standalone', async () => {
  await testLoading(DIRECTORY, '#backdrop-loading');
});
