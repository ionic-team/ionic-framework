import { testModal } from '../test.utils';

const DIRECTORY = 'sheet';

test('modal: sheet', async () => {
  await testModal(DIRECTORY, '#sheet-modal');
});

test('modal:rtl: sheet', async () => {
  await testModal(DIRECTORY, '#sheet-modal', true);
});
