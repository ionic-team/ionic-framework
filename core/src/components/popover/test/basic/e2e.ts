import { newE2EPage } from '@stencil/core/testing';

function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

async function testPopover(selector: string, rtl = false, screenshotName: string = cleanScreenshotName(selector)) {
  try {
    let pageUrl = '/src/components/popover/test/basic?ionic:_testing=true';
    if (rtl) {
      pageUrl = `${pageUrl}&rtl=true`;
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    await page.click(selector);
    let popover = await page.find('ion-popover');
    await popover.waitForVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await popover.callMethod('dismiss');
    await popover.waitForNotVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    popover = await page.find('ion-popover');
    expect(popover).toBeNull();

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

test('popover: basic', async () => {
  await testPopover('#basic-popover');
});

test('popover: translucent', async () => {
  await testPopover('#translucent-popover');
});

test('popover: long list', async () => {
  await testPopover('#long-list-popover');
});

test('popover: no event', async () => {
  await testPopover('#no-event-popover');
});

test('popover: custom class', async () => {
  await testPopover('#custom-class-popover');
});

/**
 * RTL Tests
 */

test('popover:rtl: basic', async () => {
  await testPopover('#basic-popover', true);
});

test('popover:rtl: translucent', async () => {
  await testPopover('#translucent-popover', true);
});

test('popover:rtl: long list', async () => {
  await testPopover('#long-list-popover', true);
});

test('popover:rtl: no event', async () => {
  await testPopover('#no-event-popover', true);
});

test('popover:rtl: custom class', async () => {
  await testPopover('#custom-class-popover', true);
});
