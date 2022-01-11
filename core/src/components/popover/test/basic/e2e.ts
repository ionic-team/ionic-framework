import { testPopover } from '../test.utils';
import { newE2EPage } from '@stencil/core/testing';

const DIRECTORY = 'basic';

/**
 * Focusing happens async inside of popover so we need
 * to wait for the requestAnimationFrame to fire.
 */
const expectActiveElementTextToEqual = async (page, textValue) => {
  await page.waitFor((text) => document.activeElement.textContent === text, {}, textValue)
}

test('popover: focus trap', async () => {
  const page = await newE2EPage({ url: '/src/components/popover/test/basic?ionic:_testing=true' });

  await page.click('#basic-popover');
  await page.waitForSelector('#basic-popover');

  let popover = await page.find('ion-popover');

  expect(popover).not.toBe(null);
  await popover.waitForVisible();

  await page.keyboard.press('Tab');

  await expectActiveElementTextToEqual(page, 'Item 0');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  await expectActiveElementTextToEqual(page, 'Item 3');

  await page.keyboard.press('Tab');

  await expectActiveElementTextToEqual(page, 'Item 0');

  await page.keyboard.press('ArrowDown');

  await expectActiveElementTextToEqual(page, 'Item 1');

  await page.keyboard.press('ArrowDown');

  await expectActiveElementTextToEqual(page, 'Item 2');

  await page.keyboard.press('Home');

  await expectActiveElementTextToEqual(page, 'Item 0');

  await page.keyboard.press('End');

  await expectActiveElementTextToEqual(page, 'Item 3');
});

test('popover: basic', async () => {
  await testPopover(DIRECTORY, '#basic-popover');
});

test('popover: translucent', async () => {
  await testPopover(DIRECTORY, '#translucent-popover');
});

test('popover: long list', async () => {
  await testPopover(DIRECTORY, '#long-list-popover');
});

test('popover: no event', async () => {
  await testPopover(DIRECTORY, '#no-event-popover');
});

test('popover: custom class', async () => {
  await testPopover(DIRECTORY, '#custom-class-popover');
});

test('popover: header', async () => {
  await testPopover(DIRECTORY, '#header-popover');
});

test('popover: translucent header', async () => {
  await testPopover(DIRECTORY, '#translucent-header-popover');
});

/**
 * RTL Tests
 */

test('popover:rtl: basic', async () => {
  await testPopover(DIRECTORY, '#basic-popover', true, true);
});

test('popover:rtl: translucent', async () => {
  await testPopover(DIRECTORY, '#translucent-popover', true, true);
});

test('popover:rtl: long list', async () => {
  await testPopover(DIRECTORY, '#long-list-popover', true, true);
});

test('popover:rtl: no event', async () => {
  await testPopover(DIRECTORY, '#no-event-popover', true, true);
});

test('popover:rtl: custom class', async () => {
  await testPopover(DIRECTORY, '#custom-class-popover', true, true);
});

test('popover:rtl: header', async () => {
  await testPopover(DIRECTORY, '#header-popover', true);
});

test('popover:rtl: translucent header', async () => {
  await testPopover(DIRECTORY, '#translucent-header-popover', true);
});

test('popover: htmlAttributes', async () => {
  const page = await newE2EPage({ url: '/src/components/popover/test/basic?ionic:_testing=true' });

  await page.click('#basic-popover');
  await page.waitForSelector('#basic-popover');

  let alert = await page.find('ion-popover');

  expect(alert).not.toBe(null);
  await alert.waitForVisible();

  const attribute = await page.evaluate((el) => document.querySelector('ion-popover').getAttribute('data-testid'));

  expect(attribute).toEqual('basic-popover');
});
