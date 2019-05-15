import { testModal } from '../test.utils';

const DIRECTORY = 'standalone';

test('modal: basic', async () => {
  await testModal(DIRECTORY, '#basic-modal');
});
