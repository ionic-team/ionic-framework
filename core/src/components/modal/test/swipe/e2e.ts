import { testModal } from '../test.utils';

const DIRECTORY = 'swipe';

test('modal: swipe', async () => {
  await testModal(DIRECTORY, '#swipe-modal');
});

test('modal:rtl: swipe', async () => {
  await testModal(DIRECTORY, '#swipe-modal', true);
});
