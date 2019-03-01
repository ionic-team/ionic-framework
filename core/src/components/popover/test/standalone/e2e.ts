import { testPopover } from '../test.utils';

const DIRECTORY = 'standalone';

test('popover: standalone', async () => {
  await testPopover(DIRECTORY, '#basic-popover');
});
