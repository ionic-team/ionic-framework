import { testToast } from '../test.utils';

const DIRECTORY = 'buttons';

test('toast: close property', async () => {
  await testToast(DIRECTORY, '#closeProp');
});

test('toast: close array', async () => {
  await testToast(DIRECTORY, '#closeArray');
});

test('toast: two buttons', async () => {
  await testToast(DIRECTORY, '#twoButtons');
});

test('toast: multiple buttons', async () => {
  await testToast(DIRECTORY, '#multipleButtons');
});

test('toast: long button', async () => {
  await testToast(DIRECTORY, '#longButton');
});

/**
 * RTL Tests
 */

test('toast:rtl: close property', async () => {
  await testToast(DIRECTORY, '#closeProp', true);
});

test('toast:rtl: close array', async () => {
  await testToast(DIRECTORY, '#closeArray', true);
});

test('toast:rtl: two buttons', async () => {
  await testToast(DIRECTORY, '#twoButtons', true);
});

test('toast:rtl: multiple buttons', async () => {
  await testToast(DIRECTORY, '#multipleButtons', true);
});

test('toast:rtl: long button', async () => {
  await testToast(DIRECTORY, '#longButton', true);
});
