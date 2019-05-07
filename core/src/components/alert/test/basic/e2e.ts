import { testAlert } from '../test.utils';

const DIRECTORY = 'basic';

test(`alert: basic`, async () => {
  await testAlert(DIRECTORY, '#basic');
});

test(`alert: basic, long message`, async () => {
  await testAlert(DIRECTORY, '#longMessage');
});

test(`alert: basic, multiple buttons`, async () => {
  await testAlert(DIRECTORY, '#multipleButtons');
});

test(`alert: basic, no message`, async () => {
  await testAlert(DIRECTORY, '#noMessage');
});

test(`alert: basic, confirm`, async () => {
  await testAlert(DIRECTORY, '#confirm');
});

test(`alert: basic, prompt`, async () => {
  await testAlert(DIRECTORY, '#prompt');
});

test(`alert: basic, radio`, async () => {
  await testAlert(DIRECTORY, '#radio');
});

test(`alert: basic, checkbox`, async () => {
  await testAlert(DIRECTORY, '#checkbox');
});

// Right to Left tests
// ------------------------------------------------------

test(`alert:rtl: basic`, async () => {
  await testAlert(DIRECTORY, '#basic', true);
});

test(`alert:rtl: basic, long message`, async () => {
  await testAlert(DIRECTORY, '#longMessage', true);
});

test(`alert:rtl: basic, multiple buttons`, async () => {
  await testAlert(DIRECTORY, '#multipleButtons', true);
});

test(`alert:rtl: basic, no message`, async () => {
  await testAlert(DIRECTORY, '#noMessage', true);
});

test(`alert:rtl: basic, confirm`, async () => {
  await testAlert(DIRECTORY, '#confirm', true);
});

test(`alert:rtl: basic, prompt`, async () => {
  await testAlert(DIRECTORY, '#prompt', true);
});

test(`alert:rtl: basic, radio`, async () => {
  await testAlert(DIRECTORY, '#radio', true);
});

test(`alert:rtl: basic, checkbox`, async () => {
  await testAlert(DIRECTORY, '#checkbox', true);
});
