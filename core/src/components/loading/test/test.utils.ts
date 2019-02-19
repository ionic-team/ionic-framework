import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testLoading(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/loading/test/${type}?ionic:_testing=true`;
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
    
    let loading = await page.find('ion-loading');
    expect(loading).not.toBeNull();

    await loading.waitForVisible();

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await loading.callMethod('dismiss');
    await loading.waitForNotVisible();

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    loading = await page.find('ion-loading');
    expect(loading).toBeNull();

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}
