import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testModal(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/modal/test/${type}?ionic:_testing=true`;
    if (rtl) {
      pageUrl = `${pageUrl}&rtl=true`;
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    await page.click(selector);
    let popover = await page.find('ion-modal');
    await popover.waitForVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await popover.callMethod('dismiss');
    await popover.waitForNotVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    popover = await page.find('ion-modal');
    expect(popover).toBeNull();

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}
