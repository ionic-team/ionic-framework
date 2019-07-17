import { E2EElement, E2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';

export const generateE2EUrl = (component: string, type: string, rtl = false): string => {
  let url = `/src/components/${component}/test/${type}?ionic:_testing=true`;
  if (rtl) {
    url = `${url}&rtl=true`;
  }

  return url;
};

/**
 * Gets the value of a property on an element
 */
export const getElementProperty = async (element: any, property: string): Promise<string> => {
  const getProperty = await element.getProperty(property);
  if (!getProperty) { return ''; }

  return getProperty.jsonValue();
};

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

/**
 * Pierce through shadow roots
 * https://github.com/GoogleChrome/puppeteer/issues/858#issuecomment-359763824
 */
export const queryDeep = async (page: E2EPage, ...selectors: string[]): Promise<ElementHandle> => {
  const shadowSelectorFn = (el: Element, selector: string): Element | null => (el && el.shadowRoot) && el.shadowRoot.querySelector(selector);

  return new Promise(async resolve => {
    const [firstSelector, ...restSelectors] = selectors;
    let parentElement = await page.$(firstSelector);

    for (const selector of restSelectors) {
      parentElement = await page.evaluateHandle(shadowSelectorFn, parentElement, selector) as any;
    }

    if (parentElement) { resolve(parentElement); }
  });
};

/**
 * Given an element and optional selector, use the selector if
 * it exists or get the node name of that element if not. Combine
 * with the current mode to verify the correct classes exist.
 *
 * @param el: E2EElement - The element to verify classes on
 * @param selector: string - A selector to use instead of the element tag name
 *
 * Examples:
 * await checkComponentModeClasses(await page.find('ion-card-content'))
 * => expect(el).toHaveClass(`card-content-{mode}`);
 *
 * await checkComponentModeClasses(await page.find('ion-card-content'), 'some-class')
 * => expect(el).toHaveClass(`some-class-{mode}`);
 */
export const checkComponentModeClasses = async (el: E2EElement, selector?: string) => {
  // If passed a selector to use, use that, else grab the nodeName
  // of the element and remove the ion prefix to get the class selector
  const component = selector !== undefined ? selector : el.nodeName.toLowerCase().replace('ion-', '');

  const mode = await el.getProperty('mode');

  expect(el).toHaveClass(`${component}-${mode}`);
};

/**
 * Given an element, get the mode and verify it exists as a class
 *
 * @param el: E2EElement - the element to verify the mode class on
 */
export const checkModeClasses = async (el: E2EElement, globalMode: string) => {
  const mode = (await el.getProperty('mode')) || globalMode;
  expect(el).toHaveClass(`${mode}`);
};
