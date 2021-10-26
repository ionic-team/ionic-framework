import { newE2EPage } from '@stencil/core/testing';

test('select: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/basic?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  // Gender Alert Select
  let select = await page.find('#gender');

  // add an event spy to the select
  const ionDismiss = await select.spyOnEvent('ionDismiss');

  await select.click();

  let alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open gender single select'));

  await alert.callMethod('dismiss');

  expect(ionDismiss).toHaveReceivedEvent();

  // Skittles Action Sheet Select
  select = await page.find('#skittles');
  await select.click();

  let actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open skittles action sheet select'));

  await actionSheet.callMethod('dismiss');

  expect(ionDismiss).toHaveReceivedEvent();

  // Custom Alert Select
  select = await page.find('#customAlertSelect');
  await select.click();

  alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open custom alert select'));

  await alert.callMethod('dismiss');

  expect(ionDismiss).toHaveReceivedEvent();

  // Custom Popover Select
  select = await page.find('#customPopoverSelect');
  await select.click();

  const popover = await page.find('ion-popover');
  await popover.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open custom popover select'));

  await popover.callMethod('dismiss');

  expect(ionDismiss).toHaveReceivedEvent();

  // Custom Action Sheet Select
  select = await page.find('#customActionSheetSelect');
  await select.click();

  actionSheet = await page.find('ion-action-sheet');
  await actionSheet.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open custom action sheet select'));

  await actionSheet.callMethod('dismiss');

  expect(ionDismiss).toHaveReceivedEvent();

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

test('select:rtl: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/basic?ionic:_testing=true&rtl=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
