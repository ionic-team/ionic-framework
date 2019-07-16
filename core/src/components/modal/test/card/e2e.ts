import { testModal } from '../test.utils';

const DIRECTORY = 'basic';

test('modal: card', async () => {
  await testModal(DIRECTORY, '#card-modal');
});

test('modal:rtl: card', async () => {
  await testModal(DIRECTORY, '#card-modal', true);
});
