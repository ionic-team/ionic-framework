import { componentOnReady } from '../helpers';
import { printRequiredElementError } from '../logging';

const ION_CONTENT_TAG_NAME = 'ION-CONTENT';
const ION_CONTENT_ELEMENT_SELECTOR = 'ion-content';
const ION_CONTENT_CLASS_SELECTOR = '.ion-content-scroll-host';
/**
 * Selector used for implementations reliant on `<ion-content>` for scroll event changes.
 *
 * Developers should use the `.ion-content-scroll-host` selector to target the element emitting
 * scroll events. With virtual scroll implementations this will be the host element for
 * the scroll viewport.
 */
const ION_CONTENT_SELECTOR = `${ION_CONTENT_ELEMENT_SELECTOR}, ${ION_CONTENT_CLASS_SELECTOR}`;

const isIonContent = (el: Element) => el && el.tagName === ION_CONTENT_TAG_NAME;

/**
 * Waits for the element host fully initialize before
 * returning the inner scroll element.
 *
 * For `ion-content` the scroll target will be the result
 * of the `getScrollElement` function.
 *
 * For custom implementations it will be the element host
 * or a selector within the host, if supplied through `scrollTarget`.
 */
export const getScrollElement = async (el: Element) => {
  if (isIonContent(el)) {
    await new Promise((resolve) => componentOnReady(el, resolve));
    return (el as HTMLIonContentElement).getScrollElement();
  }

  return el as HTMLElement;
};

/**
 * Queries the element matching the selector for IonContent.
 * See ION_CONTENT_SELECTOR for the selector used.
 */
export const findIonContent = (el: Element) => {
  /**
   * First we try to query the custom scroll host selector in cases where
   * the implementation is using an outer `ion-content` with an inner custom
   * scroll container.
   */
  const customContentHost = el.querySelector<HTMLElement>(ION_CONTENT_CLASS_SELECTOR);
  if (customContentHost) {
    return customContentHost;
  }
  return el.querySelector<HTMLElement>(ION_CONTENT_SELECTOR);
};

/**
 * Queries the closest element matching the selector for IonContent.
 */
export const findClosestIonContent = (el: Element) => {
  return el.closest<HTMLElement>(ION_CONTENT_SELECTOR);
};

/**
 * Scrolls to the top of the element. If an `ion-content` is found, it will scroll
 * using the public API `scrollToTop` with a duration.
 */
export const scrollToTop = (el: HTMLElement, durationMs: number): Promise<any> => {
  if (isIonContent(el)) {
    const content = el as HTMLIonContentElement;
    return content.scrollToTop(durationMs);
  }
  return Promise.resolve(
    el.scrollTo({
      top: 0,
      left: 0,
      behavior: durationMs > 0 ? 'smooth' : 'auto',
    })
  );
};

/**
 * Scrolls by a specified X/Y distance in the component. If an `ion-content` is found, it will scroll
 * using the public API `scrollByPoint` with a duration.
 */
export const scrollByPoint = (el: HTMLElement, x: number, y: number, durationMs: number) => {
  if (isIonContent(el)) {
    const content = el as HTMLIonContentElement;
    return content.scrollByPoint(x, y, durationMs);
  }
  return Promise.resolve(
    el.scrollBy({
      top: y,
      left: x,
      behavior: durationMs > 0 ? 'smooth' : 'auto',
    })
  );
};

/**
 * Prints an error informing developers that an implementation requires an element to be used
 * within either the `ion-content` selector or the `.ion-content-scroll-host` class.
 */
export const printIonContentErrorMsg = (el: HTMLElement) => {
  return printRequiredElementError(el, ION_CONTENT_ELEMENT_SELECTOR);
};
