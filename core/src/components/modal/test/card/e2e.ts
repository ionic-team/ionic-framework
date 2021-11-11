import { testModal } from '../test.utils';

const DIRECTORY = 'card';

test('modal: card', async () => {
  await testModal(DIRECTORY, '#card', true);
});
test('modal: card - custom', async () => {
  await testModal(DIRECTORY, '#card-custom', true);
});
