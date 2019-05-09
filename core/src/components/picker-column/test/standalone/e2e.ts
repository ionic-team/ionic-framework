import { testPickerColumn } from '../test.utils';

const TEST_TYPE = 'standalone';

test('picker-column: standalone', async () => {
  await testPickerColumn(TEST_TYPE, '#single-column-button');
});

test('picker-column:multi-column standalone', async () => {
  await testPickerColumn(TEST_TYPE, '#multiple-column-button');
});

test('picker-column:rtl: standalone', async () => {
  await testPickerColumn(TEST_TYPE, '#single-column-button', true);
});

test('picker-column:multi-column:rtl standalone', async () => {
  await testPickerColumn(TEST_TYPE, '#multiple-column-button', true);
});
