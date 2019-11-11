import { testActionSheet } from '../test.utils';

const DIRECTORY = 'translucent';

test('action-sheet: translucent', async () => {
  await testActionSheet(DIRECTORY, '#basic');
});
