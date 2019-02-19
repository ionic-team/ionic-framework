import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testAlert(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/alert/test/${type}?ionic:_testing=true`;
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

    let alert = await page.find('ion-alert');

    expect(alert).not.toBe(null);
    await alert.waitForVisible();

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await alert.callMethod('dismiss');
    await alert.waitForNotVisible();

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    alert = await page.find('ion-alert');
    expect(alert).toBe(null);

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}
