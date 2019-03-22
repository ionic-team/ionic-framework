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

/**
 * Listens for an event and fires a callback
 * @param page - The Puppeteer `page` object
 * @param eventType: string - The event name to listen for. ex: `ionPickerColChange`
 * @param element: HTMLElement - An HTML element
 * @param callbackName: string - The name of the callback function to
 * call when the event is fired.
 *
 * Note: The callback function must be added using
 * page.exposeFunction prior to calling this function.
 */
export const listenForEvent = async (page: any, eventType: string, element: any, callbackName: string): Promise<any> => {
  try {
      return await page.evaluate((scopeEventType: string, scopeElement: any, scopeCallbackName: string) => {
        scopeElement.addEventListener(scopeEventType, (e: any) => {
          (window as any)[scopeCallbackName](e);
        });
      }, eventType, element, callbackName);
  } catch (err) {
    throw err;
  }
};

/**
 * Drags an element by (x, y) pixels
 * @param element: HTMLElement - The HTML Element to drag
 * @param page - The Puppeteer 'page' object
 * @param x: number - Amount to drag `element` by on the x-axis
 * @param y: number - Amount to drag `element` by on the y-axis
 */
export const dragElementBy = async (element: any, page: any, x = 0, y = 0): Promise<void> => {
  try {
    const boundingBox = await element.boundingBox();

    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    const endX = startX + x;
    const endY = startY + y;

    const midX = endX / 2;
    const midY = endY / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(midX, midY);
    await page.mouse.move(endX, endY);
    await page.mouse.up();

  } catch (err) {
    throw err;
  }
};

/**
 * Wait for a function to return true
 * This method runs in the context of the
 * test whereas page.waitForFunction runs in
 * the context of the browser
 * @param fn - The function to run
 * @param params: any - Any parameters that the fn needs
 * @param interval: number - Interval to run setInterval on
 */
export const waitForFunctionTestContext = async (fn: any, params: any, interval = 16): Promise<any> => {
  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (fn(params)) {
        clearInterval(intervalId);
        return resolve();
      }
    }, interval);
  });
};

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
