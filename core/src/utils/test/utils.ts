import { E2EElement } from '@stencil/core/testing';

export function generateE2EUrl(component: string, type: string, rtl = false): string {
  let url = `/src/components/${component}/test/${type}?ionic:_testing=true`;
  if (rtl) {
    url = `${url}&rtl=true`;
  }

  return url;
}

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

// Given an element, get the node name of that element
// and its current mode to verify the correct mode class exists
//
// Example:
// await checkModeClasses(await page.find('ion-card-content'))
//
// ios => expect(el).toHaveClass(`card-content-ios`);
// mode => expect(el).toHaveClass(`card-content-md`);
// -----------------------------------------------------------------
export async function checkModeClasses(el: E2EElement, name?: string) {
  // If passed a name to use, use that, else grab the nodeName
  // of the element and remove the ion prefix to get the class name
  const selector = name ? name : el.nodeName.toLowerCase().replace('ion-', '');
  const mode = await el.getProperty('mode');
  expect(el).toHaveClass(`${selector}-${mode}`);

  // TODO remove
  console.log('selector', selector, 'mode', mode);
}
