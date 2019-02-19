import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testPopover(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/popover/test/${type}?ionic:_testing=true`;
    if (rtl) {
      pageUrl = `${pageUrl}&rtl=true`;
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let popover = await page.find('ion-popover');
    await popover.waitForVisible();

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await popover.callMethod('dismiss');
    await popover.waitForNotVisible();

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
