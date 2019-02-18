import { newE2EPage } from '@stencil/core/testing';

async function testToast(selector: string, screenshotName: string, dismissedScreenshotName: string, rtl = false) {
  try {
    let pageUrl = '/src/components/toast/test/basic?ionic:_testing=true';
    if (rtl) { pageUrl = `${pageUrl}&rtl=true`; }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    const button = await page.find(selector);
    await button.click();

    let toast = await page.find('ion-toast');
    await toast.waitForVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await toast.callMethod('dismiss');
    await toast.waitForNotVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(dismissedScreenshotName));

    toast = await page.find('ion-toast');
    expect(toast).toBeNull();

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

test('toast: bottom', async () => {
  const screenshotName = 'bottom toast';
  await testToast('#showBottomToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: middle', async () => {
  const screenshotName = 'middle toast';
  await testToast('#showMiddleToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: top', async () => {
  const screenshotName = 'bottom toast';
  await testToast('#showTopToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: two lines', async () => {
  const screenshotName = 'two line';
  await testToast('#twoLineToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: close button', async () => {
  const screenshotName = 'close button';
  await testToast('#closeButtonToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: custom close text', async () => {
  const screenshotName = 'custom close text';
  await testToast('#customCloseTextToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: translucent', async () => {
  const screenshotName = 'translucent toast';
  await testToast('#translucentToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: color', async () => {
  const screenshotName = 'color toast';
  await testToast('#colorToast', screenshotName, `dismissed ${screenshotName}`);
});

test('toast: custom class', async () => {
  const screenshotName = 'custom class toast';
  await testToast('#customClassToast', screenshotName, `dismissed ${screenshotName}`);
});

/**
 * RTL Tests
 */

test('toast:rtl: bottom', async () => {
  const screenshotName = 'bottom toast rtl';
  await testToast('#showBottomToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: middle', async () => {
  const screenshotName = 'middle toast rtl';
  await testToast('#showMiddleToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: top', async () => {
  const screenshotName = 'top toast rtl';
  await testToast('#showTopToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: two lines', async () => {
  const screenshotName = 'two line';
  await testToast('#twoLineToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: close button', async () => {
  const screenshotName = 'close button';
  await testToast('#closeButtonToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: custom close text', async () => {
  const screenshotName = 'custom close text';
  await testToast('#customCloseTextToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: translucent', async () => {
  const screenshotName = 'translucent toast';
  await testToast('#translucentToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: color', async () => {
  const screenshotName = 'color toast';
  await testToast('#colorToast', screenshotName, `dismissed ${screenshotName}`, true);
});

test('toast:rtl: custom class', async () => {
  const screenshotName = 'custom class toast';
  await testToast('#customClassToast', screenshotName, `dismissed ${screenshotName}`, true);
});
