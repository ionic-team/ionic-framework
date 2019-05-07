import { testPopover } from '../test.utils';

const DIRECTORY = 'basic';

test('popover: basic', async () => {
  await testPopover(DIRECTORY, '#basic-popover');
});

test('popover: translucent', async () => {
  await testPopover(DIRECTORY, '#translucent-popover');
});

test('popover: long list', async () => {
  await testPopover(DIRECTORY, '#long-list-popover');
});

test('popover: no event', async () => {
  await testPopover(DIRECTORY, '#no-event-popover');
});

test('popover: custom class', async () => {
  await testPopover(DIRECTORY, '#custom-class-popover');
});

/**
 * RTL Tests
 */

test('popover:rtl: basic', async () => {
  await testPopover(DIRECTORY, '#basic-popover', true);
});

test('popover:rtl: translucent', async () => {
  await testPopover(DIRECTORY, '#translucent-popover', true);
});

test('popover:rtl: long list', async () => {
  await testPopover(DIRECTORY, '#long-list-popover', true);
});

test('popover:rtl: no event', async () => {
  await testPopover(DIRECTORY, '#no-event-popover', true);
});

test('popover:rtl: custom class', async () => {
  await testPopover(DIRECTORY, '#custom-class-popover', true);
});
