import { testActionSheet, testActionSheetAlert, testActionSheetBackdrop } from '../test.utils';

const DIRECTORY = 'basic';

test('action-sheet: basic', async () => {
  await testActionSheet(DIRECTORY, '#basic');
});

test('action-sheet: basic, alert from action sheet', async () => {
  await testActionSheet(DIRECTORY, '#alertFromActionSheet', false, testActionSheetAlert);
});

test('action-sheet: basic, cancel only', async () => {
  await testActionSheet(DIRECTORY, '#cancelOnly');
});

test('action-sheet: basic, custom', async () => {
  await testActionSheet(DIRECTORY, '#custom');
});

test('action-sheet: basic, icons', async () => {
  await testActionSheet(DIRECTORY, '#icons');
});

test('action-sheet: basic, no backdrop dismiss', async () => {
  await testActionSheet(DIRECTORY, '#noBackdropDismiss', false, testActionSheetBackdrop);
});

test('action-sheet: basic, scrollable options', async () => {
  await testActionSheet(DIRECTORY, '#scrollableOptions');
});

test('action-sheet: basic, scroll without cancel', async () => {
  await testActionSheet(DIRECTORY, '#scrollWithoutCancel');
});

/**
 * RTL Tests
 */

test('action-sheet:rtl: basic', async () => {
  await testActionSheet(DIRECTORY, '#basic', true);
});

test('action-sheet:rtl: basic, alert from action sheet', async () => {
  await testActionSheet(DIRECTORY, '#alertFromActionSheet', true, testActionSheetAlert);
});

test('action-sheet:rtl: basic, cancel only', async () => {
  await testActionSheet(DIRECTORY, '#cancelOnly', true);
});

test('action-sheet:rtl: basic, custom', async () => {
  await testActionSheet(DIRECTORY, '#custom', true);
});

test('action-sheet:rtl: basic, icons', async () => {
  await testActionSheet(DIRECTORY, '#icons', true);
});

test('action-sheet:rtl: basic, no backdrop dismiss', async () => {
  await testActionSheet(DIRECTORY, '#noBackdropDismiss', true, testActionSheetBackdrop);
});

test('action-sheet:rtl: basic, scrollable options', async () => {
  await testActionSheet(DIRECTORY, '#scrollableOptions', true);
});

test('action-sheet:rtl: basic, scroll without cancel', async () => {
  await testActionSheet(DIRECTORY, '#scrollWithoutCancel', true);
});
