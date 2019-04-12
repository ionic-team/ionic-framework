import { testToast } from '../test.utils';

const DIRECTORY = 'buttons';

test('toast: buttons, close property', async () => {
  await testToast(DIRECTORY, '#closeProp');
});

test('toast: buttons, close array', async () => {
  await testToast(DIRECTORY, '#closeArray');
});

test('toast: buttons, two buttons', async () => {
  await testToast(DIRECTORY, '#twoButtons');
});

test('toast: buttons, multiple buttons', async () => {
  await testToast(DIRECTORY, '#multipleButtons');
});

test('toast: buttons, long button', async () => {
  await testToast(DIRECTORY, '#longButton');
});

/**
 * RTL Tests
 */

test('toast:rtl: buttons, close property', async () => {
  await testToast(DIRECTORY, '#closeProp', true);
});

test('toast:rtl: buttons, close array', async () => {
  await testToast(DIRECTORY, '#closeArray', true);
});

test('toast:rtl: buttons, two buttons', async () => {
  await testToast(DIRECTORY, '#twoButtons', true);
});

test('toast:rtl: buttons, multiple buttons', async () => {
  await testToast(DIRECTORY, '#multipleButtons', true);
});

test('toast:rtl: buttons, long button', async () => {
  await testToast(DIRECTORY, '#longButton', true);
});
