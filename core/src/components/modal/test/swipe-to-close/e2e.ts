import { testModal } from '../test.utils';

const DIRECTORY = 'swipe-to-close';

test('modal: swipe-to-close', async () => {
  await testModal(DIRECTORY, '#basic-modal');
});

test('modal:rtl: swipe-to-close', async () => {
  await testModal(DIRECTORY, '#basic-modal', true);
});
