import { testLoading } from '../test.utils';
import { newE2EPage } from '@stencil/core/testing';

const DIRECTORY = 'basic';
const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return await page.evaluate(el => el && el.textContent, activeElement);
}

test('loading: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/loading/test/basic?ionic:_testing=true' });

  await page.click('#html-content-loading');
  await page.waitForSelector('#html-content-loading');

  let loading = await page.find('ion-loading');

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

test('loading: basic', async () => {
  await testLoading(DIRECTORY, '#basic-loading');
});

test('loading: long content basic', async () => {
  await testLoading(DIRECTORY, '#long-content-loading');
});

test('loading: no spinner basic', async () => {
  await testLoading(DIRECTORY, '#no-spinner-loading');
});

test('loading: translucent basic', async () => {
  await testLoading(DIRECTORY, '#translucent-loading');
});

test('loading: custom class basic', async () => {
  await testLoading(DIRECTORY, '#custom-class-loading');
});

test('loading: backdrop standalone', async () => {
  await testLoading(DIRECTORY, '#backdrop-loading');
});

test('loading: html content basic', async () => {
  await testLoading(DIRECTORY, '#html-content-loading');
});

/**
 * RTL Tests
 */

test('loading:rtl: basic basic', async () => {
  await testLoading(DIRECTORY, '#basic-loading', true);
});

test('loading:rtl: long content basic', async () => {
  await testLoading(DIRECTORY, '#long-content-loading', true);
});

test('loading:rtl: no spinner basic', async () => {
  await testLoading(DIRECTORY, '#no-spinner-loading', true);
});

test('loading:rtl: translucent basic', async () => {
  await testLoading(DIRECTORY, '#translucent-loading', true);
});

test('loading:rtl: custom class basic', async () => {
  await testLoading(DIRECTORY, '#custom-class-loading', true);
});

test('loading:rtl: backdrop standalone', async () => {
  await testLoading(DIRECTORY, '#backdrop-loading', true);
});

test('loading:rtl: html content basic', async () => {
  await testLoading(DIRECTORY, '#html-content-loading', true);
});
