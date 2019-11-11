import { testToast } from '../test.utils';

const DIRECTORY = 'standalone';

test('toast: standalone', async () => {
  await testToast(DIRECTORY, '#basic-toast');
});
