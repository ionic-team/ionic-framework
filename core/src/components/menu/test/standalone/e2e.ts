import { testMenu } from '../test.utils';

const DIRECTORY = 'standalone';

test('menu: start standalone', async () => {
  await testMenu(DIRECTORY, '#start-menu');
});

test('menu: end standalone', async () => {
  await testMenu(DIRECTORY, '#end-menu');
});
