import { testAlert } from '../test.utils';

const DIRECTORY = 'standalone';

test(`alert: standalone`, async () => {
  await testAlert(DIRECTORY, '#basic');
});

test(`alert: standalone, long message`, async () => {
  await testAlert(DIRECTORY, '#longMessage');
});

test(`alert: standalone, multiple buttons`, async () => {
  await testAlert(DIRECTORY, '#multipleButtons');
});

test(`alert: standalone, no message`, async () => {
  await testAlert(DIRECTORY, '#noMessage');
});

test(`alert: standalone, confirm`, async () => {
  await testAlert(DIRECTORY, '#confirm');
});

test(`alert: standalone, prompt`, async () => {
  await testAlert(DIRECTORY, '#prompt');
});

test(`alert: standalone, radio`, async () => {
  await testAlert(DIRECTORY, '#radio');
});

test(`alert: standalone, checkbox`, async () => {
  await testAlert(DIRECTORY, '#checkbox');
});
