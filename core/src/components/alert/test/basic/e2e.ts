import { testAlert } from '../test.utils';
import { newE2EPage } from '@stencil/core/testing';

const DIRECTORY = 'basic';
const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return await page.evaluate(el => el && el.textContent, activeElement);
}

test('alert: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/alert/test/basic?ionic:_testing=true' });

  await page.click('#multipleButtons');
  await page.waitForSelector('#multipleButtons');

  let alert = await page.find('ion-alert');

  expect(alert).not.toBe(null);
  await alert.waitForVisible();

  await page.keyboard.press('Tab');

  const activeElementText = await getActiveElementText(page);
  expect(activeElementText).toEqual('Open Modal');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const activeElementTextTwo = await getActiveElementText(page);
  expect(activeElementTextTwo).toEqual('Cancel');

  await page.keyboard.press('Tab');

  const activeElementTextThree = await getActiveElementText(page);
  expect(activeElementTextThree).toEqual('Open Modal');
});

test(`alert: basic`, async () => {
  await testAlert(DIRECTORY, '#basic');
});

test(`alert: basic, long message`, async () => {
  await testAlert(DIRECTORY, '#longMessage');
});

test(`alert: basic, multiple buttons`, async () => {
  await testAlert(DIRECTORY, '#multipleButtons');
});

test(`alert: basic, no message`, async () => {
  await testAlert(DIRECTORY, '#noMessage');
});

test(`alert: basic, confirm`, async () => {
  await testAlert(DIRECTORY, '#confirm');
});

test(`alert: basic, prompt`, async () => {
  await testAlert(DIRECTORY, '#prompt');
});

test(`alert: basic, radio`, async () => {
  await testAlert(DIRECTORY, '#radio');
});

test(`alert: basic, checkbox`, async () => {
  await testAlert(DIRECTORY, '#checkbox');
});

// Right to Left tests
// ------------------------------------------------------

test(`alert:rtl: basic`, async () => {
  await testAlert(DIRECTORY, '#basic', true);
});

test(`alert:rtl: basic, long message`, async () => {
  await testAlert(DIRECTORY, '#longMessage', true);
});

test(`alert:rtl: basic, multiple buttons`, async () => {
  await testAlert(DIRECTORY, '#multipleButtons', true);
});

test(`alert:rtl: basic, no message`, async () => {
  await testAlert(DIRECTORY, '#noMessage', true);
});

test(`alert:rtl: basic, confirm`, async () => {
  await testAlert(DIRECTORY, '#confirm', true);
});

test(`alert:rtl: basic, prompt`, async () => {
  await testAlert(DIRECTORY, '#prompt', true);
});

test(`alert:rtl: basic, radio`, async () => {
  await testAlert(DIRECTORY, '#radio', true);
});

test(`alert:rtl: basic, checkbox`, async () => {
  await testAlert(DIRECTORY, '#checkbox', true);
});
