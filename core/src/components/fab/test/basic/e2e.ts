import { testDisabledFab, testFab } from '../test.utils';

test('fab: basic', async () => {
  await testFab('basic', '#fab1');
});

test('fab:rtl: basic', async () => {
  await testFab('basic', '#fab1', true);
});

test('fab: disabled', async () => {
  await testDisabledFab('basic', '#fab2');
});

test('fab:rtl: disabled', async () => {
  await testDisabledFab('basic', '#fab2', true);
});
