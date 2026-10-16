import { componentOnReady } from '../helpers';
import { printRequiredElementError } from '../logging';

const ION_CONTENT_TAG_NAME = 'ION-CONTENT';
export const ION_CONTENT_ELEMENT_SELECTOR = 'ion-content';
export const ION_CONTENT_CLASS_SELECTOR = '.ion-content-scroll-host';
/**
 * Selector used for implementations reliant on `<ion-content>` for scroll event changes.
 *
 * Developers should use the `.ion-content-scroll-host` selector to target the element emitting
 * scroll events. With virtual scroll implementations this will be the host element for
 * the scroll viewport.
 */
const ION_CONTENT_SELECTOR = `${ION_CONTENT_ELEMENT_SELECTOR}, ${ION_CONTENT_CLASS_SELECTOR}`;

export const isIonContent = (el: Element) => el.tagName === ION_CONTENT_TAG_NAME;

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
 * Queries the content of the page that is currently visible inside the given element.
 *
 * Elements such as `ion-tabs` render the content of several pages at once, but only
 * show one of them. Hidden pages, pages that have not started transitioning in,
 * and content that belongs to an overlay or a menu are ignored. If more than one
 * page is visible, such as during a transition, the last one in the DOM is used.
 */
export const findVisibleIonContent = (el: Element) => {
  const contents = Array.from(el.querySelectorAll<HTMLElement>(ION_CONTENT_SELECTOR));
  const visibleContents = contents.filter((content) => {
    /**
     * Only the pages inside of the element matter. The element itself may be in
     * a page that is not visible yet, such as the page that contains `ion-tabs`
     * while it is transitioning in.
     */
    const hiddenAncestor = content.closest('.ion-page-invisible, ion-modal, ion-popover, ion-menu');

    return content.offsetParent !== null && (hiddenAncestor === null || !el.contains(hiddenAncestor));
  });

  return visibleContents.length > 0 ? visibleContents[visibleContents.length - 1] : null;
};

/**
 * Calls the callback with the content that is visible inside of the given element,
 * and again whenever a page is shown, hidden, added, or removed, even if the visible
 * content stays the same, since the page itself may have changed. Returns a function
 * that stops observing.
 */
export const observeVisibleIonContent = (el: Element, callback: (contentEl: HTMLElement | null) => void) => {
  const checkContent = () => callback(findVisibleIonContent(el));

  checkContent();

  if (typeof MutationObserver === 'undefined') {
    return () => undefined;
  }

  const affectsContent = (node: Node) =>
    node.nodeType === Node.ELEMENT_NODE &&
    ((node as Element).matches(`.ion-page, ion-tab, ${ION_CONTENT_SELECTOR}`) ||
      (node as Element).querySelector(ION_CONTENT_SELECTOR) !== null);

  /**
   * Pages are shown and hidden by adding and removing elements
   * and by toggling classes on the pages. Other changes in the
   * subtree, such as pressed states or list items, are ignored.
   */
  const observer = new MutationObserver((records) => {
    const hasPageChange = records.some((record) =>
      record.type === 'childList'
        ? Array.from(record.addedNodes).concat(Array.from(record.removedNodes)).some(affectsContent)
        : (record.target as Element).matches('.ion-page, ion-tab')
    );

    if (hasPageChange) {
      checkContent();
    }
  });
  observer.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
};

/**
 * Queries the custom scroll host an `ion-refresher` scrolls with in the given
 * `ion-content`. A refresher only pairs with the first host.
 */
export const findRefresherScrollHost = (ionContent: Element) => {
  return ionContent.querySelector<HTMLElement>(ION_CONTENT_CLASS_SELECTOR);
};

/**
 * Queries the `ion-refresher` that scrolls with the given content element,
 * which may be an `ion-content` or a custom scroll host. A refresher is a
 * `slot="fixed"` child of `ion-content`, so it is a sibling of a scroll host
 * rather than a descendant of it.
 */
export const findRefresherInContent = (contentEl: Element) => {
  // An `ion-content` owns any refresher inside it, scroll host or not.
  if (isIonContent(contentEl)) {
    return contentEl.querySelector('ion-refresher');
  }

  // A refresher needs an `ion-content` ancestor to initialize.
  const ionContent = contentEl.closest(ION_CONTENT_ELEMENT_SELECTOR);
  if (ionContent === null) {
    return null;
  }

  // Any scroll host other than the refresher's own has no refresher.
  const refresherScrollHost = findRefresherScrollHost(ionContent);
  if (refresherScrollHost === null || !refresherScrollHost.contains(contentEl)) {
    return null;
  }

  return ionContent.querySelector('ion-refresher');
};

/**
 * Scrolls to the top of the element. If an `ion-content` is found, it will scroll
 * using the public API `scrollToTop` with a duration.
 */
export const scrollToTop = (el: HTMLElement, durationMs: number): Promise<void> => {
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

/**
 * Several components in Ionic need to prevent scrolling
 * during a gesture (card modal, range, item sliding, etc).
 * Use this utility to account for ion-content and custom content hosts.
 */
export const disableContentScrollY = (contentEl: HTMLElement): boolean => {
  if (isIonContent(contentEl)) {
    const ionContent = contentEl as HTMLIonContentElement;
    const initialScrollY = ionContent.scrollY;
    ionContent.scrollY = false;

    /**
     * This should be passed into resetContentScrollY
     * so that we can revert ion-content's scrollY to the
     * correct state. For example, if scrollY = false
     * initially, we do not want to enable scrolling
     * when we call resetContentScrollY.
     */
    return initialScrollY;
  } else {
    contentEl.style.setProperty('overflow', 'hidden');

    return true;
  }
};

export const resetContentScrollY = (contentEl: HTMLElement, initialScrollY: boolean) => {
  if (isIonContent(contentEl)) {
    (contentEl as HTMLIonContentElement).scrollY = initialScrollY;
  } else {
    contentEl.style.removeProperty('overflow');
  }
};
