import { componentOnReady } from "../../utils/helpers";

const ION_CONTENT_TAG_NAME = 'ION-CONTENT';

const hasOverflowScroll = (node: Element) => {
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  // Element is scrollable if there is overflow or if the overlay is explicit
  const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
  if (!node) {
    return false;
    // The element is the node if it's scrollable or the scroll height is larger than the client height
  } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return true;
  }
  return false;
}

const getScrollContainer = (node: Element): HTMLElement | null => {
  if (hasOverflowScroll(node)) {
    return node as HTMLElement;
  }
  for (let i = 0; i < node.children.length; i++) {
    const item = node.children.item(i);
    if (item && hasOverflowScroll(item)) {
      return item as HTMLElement;
    }
  }
  return null;
}

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
  await new Promise(resolve => componentOnReady(el, resolve));

  if (el?.tagName === ION_CONTENT_TAG_NAME) {
    return await (el as HTMLIonContentElement).getScrollElement();
  }

  const scrollContainer = getScrollContainer(el);

  if (scrollContainer) {
    return scrollContainer;
  }

  return el as HTMLElement;
}

/**
 * Overrides the element selector for Ionic components reliant on `<ion-content>` for
 * scroll event changes.
 */
export const ION_CONTENT_SELECTOR = 'ion-content, .ion-content';

export const findIonContent = (el: Element) => {
  return el.querySelector<HTMLElement>(ION_CONTENT_SELECTOR);
}

export const findClosestIonContent = (el: Element) => {
  return el.closest<HTMLElement>(ION_CONTENT_SELECTOR);
}

export const scrollToTop = (el: HTMLElement, durationMs: number) => {
  if (el.tagName === ION_CONTENT_TAG_NAME) {
    const content = el as HTMLIonContentElement;
    return content.scrollToTop(durationMs);
  }
  return Promise.resolve(() => el.scrollTo(0, 0));
}

export const scrollByPoint = (el: HTMLElement, x: number, y: number, durationMs: number) => {
  if (el.tagName === ION_CONTENT_TAG_NAME) {
    const content = el as HTMLIonContentElement;
    return content.scrollByPoint(x, y, durationMs);
  }
  return el.scrollTo({
    top: y,
    left: x
  });
}

export const printIonContentErrorMsg = (el: HTMLElement) => {
  return console.error(
    `<${el.tagName.toLowerCase()}> must be used inside an <ion-content> or .ion-content`
  );
}
