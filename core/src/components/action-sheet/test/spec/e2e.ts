import { testActionSheet } from '../test.utils';

const DIRECTORY = 'spec';

test('action-sheet: spec', async () => {
  await testActionSheet(DIRECTORY, '#spec');
});
