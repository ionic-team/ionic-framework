import { testDisabledFAB, testFAB } from '../test.utils';

test('fab: basic', async () => {
  await testFAB('basic', '#fab1');
});

test('fab:rtl: basic', async () => {
  await testFAB('basic', '#fab1', true);
});

test('fab: disabled', async () => {
  await testDisabledFAB('basic', '#fab2');
});

test('fab:rtl: disabled', async () => {
  await testDisabledFAB('basic', '#fab2', true);
});
