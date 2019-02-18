import { newE2EPage } from '@stencil/core/testing';

function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

async function testToast(selector: string, rtl = false, screenshotName: string = cleanScreenshotName(selector)) {
  try {
    let pageUrl = '/src/components/toast/test/basic?ionic:_testing=true';
    if (rtl) {
      pageUrl = `${pageUrl}&rtl=true`;
      screenshotName = `${screenshotName} rtl`;
    }

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

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

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
  await testToast('#show-bottom-toast');
});

test('toast: middle', async () => {
  await testToast('#show-middle-toast');
});

test('toast: top', async () => {
  await testToast('#show-top-toast');
});

test('toast: two lines', async () => {
  await testToast('#two-line-toast');
});

test('toast: close button', async () => {
  await testToast('#close-button-toast');
});

test('toast: custom close text', async () => {
  await testToast('#custom-close-text-toast');
});

test('toast: translucent', async () => {
  await testToast('#translucent-toast');
});

test('toast: color', async () => {
  await testToast('#color-toast');
});

test('toast: custom class', async () => {
  await testToast('#custom-class-toast');
});

/**
 * RTL Tests
 */

test('toast:rtl: bottom', async () => {
  await testToast('#show-bottom-toast', true);
});

test('toast:rtl: middle', async () => {
  await testToast('#show-middle-toast', true);
});

test('toast:rtl: top', async () => {
  await testToast('#show-top-toast', true);
});

test('toast:rtl: two lines', async () => {
  await testToast('#two-line-toast', true);
});

test('toast:rtl: close button', async () => {
  await testToast('#close-button-toast', true);
});

test('toast:rtl: custom close text', async () => {
  await testToast('#custom-close-text-toast', true);
});

test('toast:rtl: translucent', async () => {
  await testToast('#translucent-toast', true);
});

test('toast:rtl: color', async () => {
  await testToast('#color-toast', true);
});

test('toast:rtl: custom class', async () => {
  await testToast('#custom-class-toast', true);
});
