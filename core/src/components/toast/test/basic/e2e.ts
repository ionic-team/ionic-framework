import { testToast } from '../test.utils';

const DIRECTORY = 'basic';

test('toast: basic, bottom', async () => {
  await testToast(DIRECTORY, '#show-bottom-toast');
});

test('toast: basic, middle', async () => {
  await testToast(DIRECTORY, '#show-middle-toast');
});

test('toast: basic, top', async () => {
  await testToast(DIRECTORY, '#show-top-toast');
});

test('toast: basic, two lines', async () => {
  await testToast(DIRECTORY, '#two-line-toast');
});

test('toast: basic, close button', async () => {
  await testToast(DIRECTORY, '#close-button-toast');
});

test('toast: basic, custom close text', async () => {
  await testToast(DIRECTORY, '#custom-close-text-toast');
});

test('toast: basic, custom buttons', async () => {
  await testToast(DIRECTORY, '#custom-action-buttons-toast');
});

test('toast: basic, translucent', async () => {
  await testToast(DIRECTORY, '#translucent-toast');
});

test('toast: basic, color', async () => {
  await testToast(DIRECTORY, '#color-toast');
});

test('toast: basic, custom class', async () => {
  await testToast(DIRECTORY, '#custom-class-toast');
});

test('toast: start end position', async () => {
  await testToast(DIRECTORY, '#toast-start-and-end');
});

test('toast: html', async () => {
  await testToast(DIRECTORY, '#toast-html');
});

/**
 * RTL Tests
 */

test('toast:rtl: basic, bottom', async () => {
  await testToast(DIRECTORY, '#show-bottom-toast', true);
});

test('toast:rtl: basic, middle', async () => {
  await testToast(DIRECTORY, '#show-middle-toast', true);
});

test('toast:rtl: basic, top', async () => {
  await testToast(DIRECTORY, '#show-top-toast', true);
});

test('toast:rtl: basic, two lines', async () => {
  await testToast(DIRECTORY, '#two-line-toast', true);
});

test('toast:rtl: basic, close button', async () => {
  await testToast(DIRECTORY, '#close-button-toast', true);
});

test('toast:rtl: basic, custom close text', async () => {
  await testToast(DIRECTORY, '#custom-close-text-toast', true);
});

test('toast:rtl: basic, custom buttons', async () => {
  await testToast(DIRECTORY, '#custom-action-buttons-toast');
});

test('toast:rtl: basic, translucent', async () => {
  await testToast(DIRECTORY, '#translucent-toast', true);
});

test('toast:rtl: basic, color', async () => {
  await testToast(DIRECTORY, '#color-toast', true);
});

test('toast:rtl: basic, custom class', async () => {
  await testToast(DIRECTORY, '#custom-class-toast', true);
});

test('toast:rtl: start end position', async () => {
  await testToast(DIRECTORY, '#toast-start-and-end', true);
});

test('toast:rtl: html', async () => {
  await testToast(DIRECTORY, '#toast-html', true);
});
