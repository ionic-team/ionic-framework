import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: basic', async () => {
  await openActionSheet('#basic');
});

test('action-sheet: basic, alert from action sheet', async () => {
  await openActionSheet('#alertFromActionSheet');
});

test('action-sheet: basic, cancel only', async () => {
  await openActionSheet('#cancelOnly');
});

test('action-sheet: basic, custom', async () => {
  await openActionSheet('#custom');
});

test('action-sheet: basic, icons', async () => {
  await openActionSheet('#icons');
});

test('action-sheet: basic, no backdrop dismiss', async () => {
  await openActionSheet('#noBackdropDismiss');
});

test('action-sheet: basic, scrollable options', async () => {
  await openActionSheet('#scrollableOptions');
});

test('action-sheet: basic, scroll without cancel', async () => {
  await openActionSheet('#scrollWithoutCancel');
});

// Opens an action sheet on button click
async function openActionSheet(selector: string) {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/basic?ionic:_testing=true`
  });

  const compares = [];

  await page.click(selector);

  let actionSheet = await page.find('ion-action-sheet');
  expect(actionSheet).not.toBe(null);
  await actionSheet.waitForVisible();

  compares.push(await page.compareScreenshot());

  if (selector === '#alertFromActionSheet') {
    const openAlertBtn = await page.find({ text: 'Open Alert' });
    await openAlertBtn.click();

    const alert = await page.find('ion-alert');
    await alert.waitForVisible();
    await page.waitFor(250);

    compares.push(await page.compareScreenshot(`alert open`));

    const alertOkayBtn = await page.find({ contains: 'Okay' });
    await alertOkayBtn.click();
  }

  if (selector === '#noBackdropDismiss') {
    const backdrop = await page.find('ion-backdrop');
    await backdrop.click();

    compares.push(await page.compareScreenshot(`dismissed`));

    const isVisible = await actionSheet.isVisible();
    expect(isVisible).toBe(true);

    const cancel = await page.find('.action-sheet-cancel');
    await cancel.click();

    await actionSheet.waitForNotVisible();
  } else {
    await actionSheet.callMethod('dismiss');
    await actionSheet.waitForNotVisible();

    compares.push(await page.compareScreenshot(`dismissed`));
  }

  actionSheet = await page.find('ion-action-sheet');
  expect(actionSheet).toBe(null);

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
}
