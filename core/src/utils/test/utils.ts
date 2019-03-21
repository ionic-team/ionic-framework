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

// Given an element and optional selector, use the selector if
// it exists or get the node name of that element if not. Combine
// with the current mode to verify the correct classes exist.
//
// Examples:
// await checkModeClasses(await page.find('ion-card-content'))
// => expect(el).toHaveClass(`card-content-{mode}`);
//
// await checkModeClasses(await page.find('ion-card-content'), 'some-class')
// => expect(el).toHaveClass(`some-class-{mode}`);
// -----------------------------------------------------------------------------
export async function checkModeClasses(el: E2EElement, selector?: string) {
  // If passed a selector to use, use that, else grab the nodeName
  // of the element and remove the ion prefix to get the class selector
  const component = selector !== undefined ? selector : el.nodeName.toLowerCase().replace('ion-', '');

  const mode = await el.getProperty('mode');

  // TODO remove
  console.log(`component: ${component} classes: ${el.className}`);

  expect(el).toHaveClass(`${component}-${mode}`);
}
