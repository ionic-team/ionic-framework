import { testLoading } from '../test.utils';

const DIRECTORY = 'standalone';

test('loading: basic standalone', async () => {
  await testLoading(DIRECTORY, '#basic-loading');
});

test('loading: long content standalone', async () => {
  await testLoading(DIRECTORY, '#long-content-loading');
});

test('loading: no spinner standalone', async () => {
  await testLoading(DIRECTORY, '#no-spinner-loading');
});

test('loading: translucent standalone', async () => {
  await testLoading(DIRECTORY, '#translucent-loading');
});

test('loading: custom class standalone', async () => {
  await testLoading(DIRECTORY, '#custom-class-loading');
});
