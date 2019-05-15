import { testModal } from '../test.utils';

const DIRECTORY = 'basic';

test('modal: basic', async () => {
  await testModal(DIRECTORY, '#basic-modal');
});

test('modal:rtl: basic', async () => {
  await testModal(DIRECTORY, '#basic-modal', true);
});
