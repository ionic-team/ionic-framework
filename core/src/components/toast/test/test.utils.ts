import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testToast(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/toast/test/${type}?ionic:_testing=true`;
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
