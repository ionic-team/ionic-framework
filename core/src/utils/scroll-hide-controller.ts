import { readTask, writeTask } from '@stencil/core';

import { getScrollElement } from './content';

const TOP_VISIBLE_THRESHOLD = 80;
const SCROLL_HIDE_THRESHOLD = 60;
const WHEEL_SUPPRESS_DURATION_MS = 80;
const SUPPRESS_SHOW_DURATION_MS = 400;

export interface ScrollHideOptions {
  /** The component's host element. */
  el: HTMLElement;
  /** CSS variable name for the hide height, e.g. `--internal-header-hide-height`. */
  cssVar: string;
  /** Class toggled on the component when hidden, e.g. `header-scroll-hidden`. */
  hiddenClass: string;
  /** Class added to content when the scroll-hide effect is active, e.g. `content-header-hide-scroll-partner`. */
  contentPartnerClass: string;
  /** Class toggled on content when hidden, e.g. `content-header-hide-scroll-hidden`. */
  contentHiddenClass: string;
  /**
   * Optional guard called before removing aria-hidden on show.
   * Return `true` to keep aria-hidden (e.g. when the keyboard is open).
   */
  shouldKeepAriaHidden?: () => boolean;
}

export type ScrollHideController = {
  /** Whether the component is currently hidden by the scroll effect. */
  isHidden: () => boolean;
  /**
   * Activate the controller by attaching listeners, observers, and
   * content classes. Must be called only after the caller confirms this
   * setup is still current (promise-identity guard). A controller that
   * is never initialized has no side effects and can be discarded.
   */
  init: () => void;
  /** Destroy all listeners, observers, and clean up DOM state. */
  destroy: () => void;
};

/**
 * Creates a controller that manages scroll-based hide/show behavior
 * for headers, footers, and tab bars.
 *
 * Listens to both wheel and scroll events. Wheel events (desktop mice)
 * give direction instantly via deltaY. Scroll events cover touch,
 * trackpad, and programmatic scrolling where wheel doesn't fire.
 * A short suppression window stops them from double-processing the
 * same gesture.
 *
 * When the user reverses scroll direction, we save that position as
 * an anchor. The bar only hides after scrolling 60px past that
 * anchor, which prevents flickering on small or jittery movements.
 * Showing is immediate on direction change.
 *
 * When `options` is provided, the controller also handles the DOM
 * setup: ResizeObserver for height tracking, CSS variable read/write,
 * content partner/hidden class toggling, inert/aria-hidden, and
 * full teardown cleanup. This avoids duplicating the same setup
 * across header, footer, and tab-bar.
 *
 * @internal
 * @param contentEl The content element to resolve the scroll element from.
 * @param options Configuration for DOM setup (classes, CSS vars, a11y).
 */
export const createScrollHideController = async (
  contentEl: HTMLElement,
  options: ScrollHideOptions
): Promise<ScrollHideController> => {
  const { el, cssVar, hiddenClass, contentPartnerClass, contentHiddenClass, shouldKeepAriaHidden } = options;

  let controllerIsHidden = false;
  let resizeObserver: ResizeObserver | undefined;

  // --- DOM setup: height tracking, classes, a11y ---

  const updateHideHeight = () => {
    readTask(() => {
      const heightPx = el.offsetHeight;
      writeTask(() => {
        el.style.setProperty(cssVar, `${heightPx}px`);
        contentEl.style.setProperty(cssVar, `${heightPx}px`);
      });
    });
  };

  const setHidden = (hidden: boolean) => {
    controllerIsHidden = hidden;
    el.classList.toggle(hiddenClass, hidden);

    if (hidden) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('inert');
      if (!shouldKeepAriaHidden || !shouldKeepAriaHidden()) {
        el.removeAttribute('aria-hidden');
      }
    }

    contentEl.classList.toggle(contentHiddenClass, hidden);
  };

  // --- Scroll math ---

  const scrollEl = await getScrollElement(contentEl);

  let lastScrollPosition = 0;
  let scrollPositionAtDirectionChange = 0;
  let lastWheelEventTimestamp = 0;
  let suppressShowUntil = 0;

  const commitHide = (hidden: boolean) => {
    if (hidden) {
      suppressShowUntil = Date.now() + SUPPRESS_SHOW_DURATION_MS;
    } else {
      suppressShowUntil = 0;
    }
    setHidden(hidden);
  };

  const handleWheel = (wheelEvent: WheelEvent) => {
    lastWheelEventTimestamp = Date.now();

    readTask(() => {
      const currentScrollTop = scrollEl.scrollTop;

      if (currentScrollTop <= TOP_VISIBLE_THRESHOLD) {
        if (controllerIsHidden) {
          writeTask(() => commitHide(false));
        }
        return;
      }

      if (wheelEvent.deltaY < 0) {
        scrollPositionAtDirectionChange = currentScrollTop;
        if (controllerIsHidden) {
          writeTask(() => commitHide(false));
        }
      } else if (wheelEvent.deltaY > 0) {
        const scrolledSinceDirectionChange = currentScrollTop - scrollPositionAtDirectionChange;
        if (scrolledSinceDirectionChange >= SCROLL_HIDE_THRESHOLD && !controllerIsHidden) {
          writeTask(() => commitHide(true));
        }
      }
    });
  };

  const handleScroll = () => {
    if (Date.now() - lastWheelEventTimestamp < WHEEL_SUPPRESS_DURATION_MS) {
      return;
    }

    readTask(() => {
      const currentScrollTop = scrollEl.scrollTop;

      if (currentScrollTop <= TOP_VISIBLE_THRESHOLD) {
        if (controllerIsHidden) {
          writeTask(() => commitHide(false));
        }
        lastScrollPosition = currentScrollTop;
        return;
      }

      if (currentScrollTop === lastScrollPosition) {
        return;
      }

      const isScrollingDown = currentScrollTop > lastScrollPosition;
      const wasScrollingDown = lastScrollPosition > scrollPositionAtDirectionChange;

      if (isScrollingDown !== wasScrollingDown) {
        scrollPositionAtDirectionChange = lastScrollPosition;
      }

      const scrolledSinceDirectionChange = Math.abs(currentScrollTop - scrollPositionAtDirectionChange);
      const requiredScrollDistance = isScrollingDown ? SCROLL_HIDE_THRESHOLD : 0;
      lastScrollPosition = currentScrollTop;

      if (scrolledSinceDirectionChange < requiredScrollDistance) {
        return;
      }

      const shouldHide = isScrollingDown;
      if (shouldHide !== controllerIsHidden) {
        if (!shouldHide && Date.now() < suppressShowUntil) {
          return;
        }
        writeTask(() => commitHide(shouldHide));
      }
    });
  };

  // --- Controller ---

  let initialized = false;

  const init = () => {
    initialized = true;

    updateHideHeight();

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateHideHeight());
      resizeObserver.observe(el);
    }

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    scrollEl.addEventListener('wheel', handleWheel as EventListener, { passive: true });

    contentEl.classList.add(contentPartnerClass);
  };

  const destroy = () => {
    if (!initialized) return;

    scrollEl.removeEventListener('scroll', handleScroll);
    scrollEl.removeEventListener('wheel', handleWheel as EventListener);

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = undefined;
    }

    contentEl.classList.remove(contentPartnerClass, contentHiddenClass);
    contentEl.style.removeProperty(cssVar);

    if (controllerIsHidden) {
      el.classList.remove(hiddenClass);
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
      controllerIsHidden = false;
    }
    el.style.removeProperty(cssVar);
  };

  const isHidden = () => controllerIsHidden;

  return { isHidden, init, destroy };
};
