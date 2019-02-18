import { testToast } from '../test.utils';

const DIRECTORY = 'basic';

test('toast: bottom', async () => {
  await testToast(DIRECTORY, '#show-bottom-toast');
});

test('toast: middle', async () => {
  await testToast(DIRECTORY, '#show-middle-toast');
});

test('toast: top', async () => {
  await testToast(DIRECTORY, '#show-top-toast');
});

test('toast: two lines', async () => {
  await testToast(DIRECTORY, '#two-line-toast');
});

test('toast: close button', async () => {
  await testToast(DIRECTORY, '#close-button-toast');
});

test('toast: custom close text', async () => {
  await testToast(DIRECTORY, '#custom-close-text-toast');
});

test('toast: translucent', async () => {
  await testToast(DIRECTORY, '#translucent-toast');
});

test('toast: color', async () => {
  await testToast(DIRECTORY, '#color-toast');
});

test('toast: custom class', async () => {
  await testToast(DIRECTORY, '#custom-class-toast');
});

/**
 * RTL Tests
 */

test('toast:rtl: bottom', async () => {
  await testToast(DIRECTORY, '#show-bottom-toast', true);
});

test('toast:rtl: middle', async () => {
  await testToast(DIRECTORY, '#show-middle-toast', true);
});

test('toast:rtl: top', async () => {
  await testToast(DIRECTORY, '#show-top-toast', true);
});

test('toast:rtl: two lines', async () => {
  await testToast(DIRECTORY, '#two-line-toast', true);
});

test('toast:rtl: close button', async () => {
  await testToast(DIRECTORY, '#close-button-toast', true);
});

test('toast:rtl: custom close text', async () => {
  await testToast(DIRECTORY, '#custom-close-text-toast', true);
});

test('toast:rtl: translucent', async () => {
  await testToast(DIRECTORY, '#translucent-toast', true);
});

test('toast:rtl: color', async () => {
  await testToast(DIRECTORY, '#color-toast', true);
});

test('toast:rtl: custom class', async () => {
  await testToast(DIRECTORY, '#custom-class-toast', true);
});
