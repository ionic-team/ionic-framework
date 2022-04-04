import { newE2EPage } from '@stencil/core/testing';

import { testModal } from '../test.utils';

const DIRECTORY = 'basic';
const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate((el) => el?.textContent, activeElement);
};

test('modal: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/basic?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#basic-modal');
  await page.waitForSelector('#basic-modal');

  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  await ionModalDidPresent.next();

  await page.keyboard.press('Tab');

  const activeElementText = await getActiveElementText(page);
  expect(activeElementText).toEqual('Dismiss Modal');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const activeElementTextTwo = await getActiveElementText(page);
  expect(activeElementTextTwo).toEqual('Dismiss Modal');

  await page.keyboard.press('Tab');

  const activeElementTextThree = await getActiveElementText(page);
  expect(activeElementTextThree).toEqual('Dismiss Modal');
});

test('modal: return focus', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/basic?ionic:_testing=true' });
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#basic-modal');
  await page.waitForSelector('#basic-modal');

  const modal = await page.find('ion-modal');
  expect(modal).not.toBe(null);

  await ionModalDidPresent.next();

  await Promise.all([
    await modal.callMethod('dismiss'),
    await ionModalDidDismiss.next(),
    await modal.waitForNotVisible(),
  ]);

  const activeElement = await page.evaluateHandle(() => document.activeElement);
  const id = await activeElement.evaluate((node) => node.id);
  expect(id).toEqual('basic-modal');
});

test('modal: basic', async () => {
  await testModal(DIRECTORY, '#basic-modal', false);
});

test('modal:rtl: basic', async () => {
  await testModal(DIRECTORY, '#basic-modal', false, true);
});

test('modal: htmlAttributes', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/basic?ionic:_testing=true' });

  await page.click('#basic-modal');
  await page.waitForSelector('#basic-modal');

  const alert = await page.find('ion-modal');

  expect(alert).not.toBe(null);
  await alert.waitForVisible();

  const attribute = await page.evaluate(() => document.querySelector('ion-modal').getAttribute('data-testid'));

  expect(attribute).toEqual('basic-modal');
});

test('it should dismiss the modal when clicking the backdrop', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/basic?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await page.click('#basic-modal');
  await ionModalDidPresent.next();

  await page.mouse.click(20, 20);
  await ionModalDidDismiss.next();
});
