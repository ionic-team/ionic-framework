import { newE2EPage } from '@stencil/core/testing';

test('action-sheet: basic', async () => {
  const page = await newE2EPage({
    url: `/src/components/action-sheet/test/basic?ionic:_testing=true`
  });

  const actionSheets = [
    ['#basic', ''],
    ['#alertFromActionSheet', 'alert from action sheet'],
    ['#cancelOnly', 'cancel only'],
    ['#custom', 'custom'],
    ['#icons', 'icons'],
    ['#noBackdropDismiss', 'no backdrop dismiss'],
    ['#scrollableOptions', 'scrollable options'],
    ['#scrollWithoutCancel', 'scroll without cancel'],
  ];

  for (const [selector, message] of actionSheets) {
    await page.click(selector);

    let actionSheet = await page.find('ion-action-sheet');
    expect(actionSheet).not.toBe(null);
    await actionSheet.waitForVisible();

    let compare = await page.compareScreenshot(message);
    expect(compare).toMatchScreenshot();

    if (selector === '#alertFromActionSheet') {
      const openAlertBtn = await page.find({ text: 'Open Alert' });
      await openAlertBtn.click();

      const alert = await page.find('ion-alert');
      await alert.waitForVisible();
      await page.waitFor(250);

      compare = await page.compareScreenshot(`alert open`);
      expect(compare).toMatchScreenshot();

      const alertOkayBtn = await page.find({ contains: 'Okay' });
      await alertOkayBtn.click();
    }

    // TODO no backdrop dismiss

    await actionSheet.callMethod('dismiss');
    await actionSheet.waitForNotVisible();

    compare = await page.compareScreenshot(`dismissed`);
    expect(compare).toMatchScreenshot();

    actionSheet = await page.find('ion-action-sheet');
    expect(actionSheet).toBe(null);
  }
});
