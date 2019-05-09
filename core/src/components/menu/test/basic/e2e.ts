import { testMenu } from '../test.utils';

const DIRECTORY = 'basic';

test('menu: start menu', async () => {
  await testMenu(DIRECTORY, '#start-menu', 'first');
});

test('menu: start custom menu', async () => {
  await testMenu(DIRECTORY, '#custom-menu', 'custom');
});

test('menu: end menu', async () => {
  await testMenu(DIRECTORY, '#end-menu');
});

/**
 * RTL Tests
 */

test('menu:rtl: start menu', async () => {
  await testMenu(DIRECTORY, '#start-menu', 'first', true);
});

test('menu:rtl: start custom menu', async () => {
  await testMenu(DIRECTORY, '#custom-menu', 'custom', true);
});

test('menu:rtl: end menu', async () => {
  await testMenu(DIRECTORY, '#end-menu', '', true);
});
