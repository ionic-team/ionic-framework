import { readTask, writeTask } from '@stencil/core';

import { getScrollElement } from './content';
import { clamp } from './helpers';

/**
 * Name of the CSS variable that holds how far the bar is currently
 * moved out of view, in pixels. Components use it to translate themselves.
 */
const OFFSET_CSS_VAR = '--internal-scroll-hide-offset';

/**
 * Name of the CSS variable that holds how far the bar is out of view as
 * a number from 0 (fully visible) to 1 (fully hidden). Components that can
 * come to rest in front of other content when they move out of view, such
 * as a footer above a tab bar, use it to fade out.
 */
const PROGRESS_CSS_VAR = '--internal-scroll-hide-progress';

/**
 * When the content is scrolled back towards a bar that is fully out of view,
 * the bar only returns if the user scrolls back quickly. Scrolling back slowly,
 * however far, keeps the bar out of the way for the user who is nudging the
 * content or re-reading something. A bar that is only partly out of view
 * follows the scroll back at any speed.
 */

// Speed in pixels per millisecond that is considered a quick scroll back
const REVEAL_VELOCITY = 0.6;
// Time in milliseconds over which the scroll back speed is measured
const VELOCITY_WINDOW_MS = 100;
// Time in milliseconds without scrolling after which a partly hidden bar settles
const SETTLE_DELAY_MS = 120;
// Time in milliseconds that the bar takes to settle
const SETTLE_DURATION_MS = 200;

export interface ScrollHideOptions {
  /** The component's host element. */
  el: HTMLElement;
  /** The side of the screen that the bar hides towards. */
  edge: 'top' | 'bottom';
  /** CSS variable name for the hide height, e.g. `--internal-header-hide-height`. */
  cssVar: string;
  /** Class toggled on the component when hidden, e.g. `header-scroll-hidden`. */
  hiddenClass: string;
  /** Class toggled on the component while it settles, e.g. `header-scroll-settling`. */
  settlingClass: string;
  /** Class added to content when the scroll-hide effect is active, e.g. `content-header-hide-scroll-partner`. */
  contentPartnerClass: string;
  /** Class toggled on content when hidden, e.g. `content-header-hide-scroll-hidden`. */
  contentHiddenClass: string;
  /**
   * Optional distance in pixels that the component has to move to be
   * out of view. Defaults to the height of the component. Components
   * that float above the content need to move further than their height.
   */
  getHideDistance?: () => number;
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
 * Creates a controller that moves a header, footer, or tab bar out of view
 * as the content scrolls, and back into view when the user scrolls back.
 *
 * The component follows the scroll pixel by pixel. Scrolling towards the end
 * of the content moves it out of view by the scrolled distance. Scrolling back
 * moves a component that is partly out of view back into view by the same
 * distance. A component that is fully out of view only returns when the user
 * scrolls back quickly, so that slow scrolling does not bring it back. Once it
 * is returning, it follows the scroll until it is fully visible or the user
 * scrolls forward again.
 * The component is always fully visible at the start of the content.
 *
 * When the user stops scrolling while the component is only partly visible,
 * it settles to the closest edge. A component that returned because the user
 * scrolled back quickly always settles fully into view.
 *
 * Only scroll events are used, so touch, wheel, trackpad, keyboard, and
 * programmatic scrolling all behave the same.
 *
 * A component that is out of view stays in the tab order and in the
 * accessibility tree, and moves back into view when an element in it
 * receives focus. This way keyboard and screen reader users can reach it
 * without having to scroll back quickly.
 *
 * The controller also handles the DOM setup: a ResizeObserver for height
 * tracking, CSS variable read/write, content partner/hidden class toggling,
 * and full teardown cleanup. This avoids duplicating the same setup across
 * header, footer, and tab-bar.
 *
 * @internal
 * @param contentEl The content element to resolve the scroll element from.
 * @param options Configuration for DOM setup (classes, CSS vars, a11y).
 */
export const createScrollHideController = async (
  contentEl: HTMLElement,
  options: ScrollHideOptions
): Promise<ScrollHideController> => {
  const { el, edge, cssVar, hiddenClass, settlingClass, contentPartnerClass, contentHiddenClass, getHideDistance } =
    options;

  let controllerIsHidden = false;
  let resizeObserver: ResizeObserver | undefined;

  // --- DOM setup: height tracking, classes, a11y ---

  /**
   * How far the component moves to be out of view, and how far
   * it is moved out of view at the moment.
   */
  let hideDistance = 0;
  let offset = 0;

  const measureHideHeight = () => {
    const heightPx = el.offsetHeight;
    hideDistance = getHideDistance !== undefined ? getHideDistance() : heightPx;

    /**
     * The content only needs to make room for components that take up
     * space in the layout. Components that float above the content,
     * such as a compact tab bar, do not.
     */
    const position = getComputedStyle(el).position;
    const contentHeightPx = position === 'absolute' || position === 'fixed' ? 0 : heightPx;

    return { heightPx, contentHeightPx };
  };

  const applyHideHeight = ({ heightPx, contentHeightPx }: { heightPx: number; contentHeightPx: number }) => {
    el.style.setProperty(cssVar, `${heightPx}px`);
    contentEl.style.setProperty(cssVar, `${contentHeightPx}px`);
  };

  const updateHideHeight = () => {
    readTask(() => {
      const heights = measureHideHeight();

      writeTask(() => {
        applyHideHeight(heights);

        // A component that is out of view stays out of view when its size changes
        if (controllerIsHidden || offset > hideDistance) {
          setOffset(hideDistance);
        }
      });
    });
  };

  const setHidden = (hidden: boolean) => {
    if (hidden === controllerIsHidden) {
      return;
    }

    controllerIsHidden = hidden;
    el.classList.toggle(hiddenClass, hidden);
    contentEl.classList.toggle(contentHiddenClass, hidden);
  };

  const setOffset = (value: number) => {
    offset = value;

    el.style.setProperty(OFFSET_CSS_VAR, `${offset}px`);
    el.style.setProperty(PROGRESS_CSS_VAR, `${hideDistance > 0 ? offset / hideDistance : 0}`);
    setHidden(hideDistance > 0 && offset >= hideDistance);
  };

  // --- Scroll math ---

  const scrollEl = await getScrollElement(contentEl);

  let lastScrollTop = 0;
  let isReturning = false;
  let isQuickScrollBack = false;
  let scrollBackSamples: { time: number; distance: number }[] = [];
  let settleTimeout: ReturnType<typeof setTimeout> | undefined;
  let settlingTimeout: ReturnType<typeof setTimeout> | undefined;

  /**
   * Speed in pixels per millisecond that the content was scrolled back with
   * over the last moments. A single large jump counts as happening in one frame.
   */
  const getScrollBackVelocity = (now: number) => {
    scrollBackSamples = scrollBackSamples.filter((sample) => now - sample.time <= VELOCITY_WINDOW_MS);

    if (scrollBackSamples.length === 0) {
      return 0;
    }

    const distance = scrollBackSamples.reduce((total, sample) => total + sample.distance, 0);
    const elapsed = now - scrollBackSamples[0].time;

    return distance / Math.max(elapsed + 16, 16);
  };

  const stopSettling = () => {
    if (settlingTimeout !== undefined) {
      clearTimeout(settlingTimeout);
      settlingTimeout = undefined;
    }
    el.classList.remove(settlingClass);
  };

  /**
   * A bar that is in the middle of settling is somewhere between the
   * offset that was set and the offset it started from, so when the user
   * scrolls again, continue from where the bar currently is.
   */
  const syncOffsetWithPosition = () => {
    if (!el.classList.contains(settlingClass)) {
      return;
    }

    const translateY = new DOMMatrix(getComputedStyle(el).transform).m42;
    offset = clamp(0, edge === 'top' ? -translateY : translateY, hideDistance);
    stopSettling();
  };

  const settle = () => {
    settleTimeout = undefined;

    if (offset <= 0 || offset >= hideDistance) {
      return;
    }

    /**
     * Close to the start of the content there is nothing to make
     * room for, so the component stays visible. A component that returned
     * on a quick scroll back continues to return, and otherwise it moves
     * to the closest edge.
     */
    const isNearStart = scrollEl.scrollTop < hideDistance;
    const target = isQuickScrollBack || isNearStart || offset < hideDistance / 2 ? 0 : hideDistance;

    el.classList.add(settlingClass);
    settlingTimeout = setTimeout(stopSettling, SETTLE_DURATION_MS);
    setOffset(target);
  };

  const handleScroll = () => {
    syncOffsetWithPosition();

    const maxScroll = Math.max(scrollEl.scrollHeight - scrollEl.clientHeight, 0);

    // Rubber band scrolling past either end is not a scroll direction.
    const scrollTop = clamp(0, scrollEl.scrollTop, maxScroll);
    const delta = scrollTop - lastScrollTop;
    lastScrollTop = scrollTop;

    if (delta === 0) {
      return;
    }

    const now = performance.now();
    let nextOffset = offset;

    if (delta > 0) {
      isReturning = false;
      isQuickScrollBack = false;
      scrollBackSamples = [];
      nextOffset = offset + delta;
    } else {
      scrollBackSamples.push({ time: now, distance: -delta });

      if (getScrollBackVelocity(now) >= REVEAL_VELOCITY) {
        isQuickScrollBack = true;
      }

      if (isQuickScrollBack || offset < hideDistance) {
        isReturning = true;
      }

      if (isReturning) {
        nextOffset = offset + delta;
      }
    }

    /**
     * The component can only move out of view as far as the content has
     * been scrolled, so it is fully visible at the start of the content.
     */
    nextOffset = clamp(0, nextOffset, Math.min(hideDistance, scrollTop));

    if (nextOffset !== offset) {
      setOffset(nextOffset);
    }

    if (settleTimeout !== undefined) {
      clearTimeout(settleTimeout);
    }
    settleTimeout = setTimeout(settle, SETTLE_DELAY_MS);
  };

  /**
   * Brings the component back into view when an element in it receives
   * focus, since the focused element would otherwise be out of view.
   */
  const handleFocusIn = () => {
    if (offset <= 0) {
      return;
    }

    isQuickScrollBack = true;
    isReturning = true;

    el.classList.add(settlingClass);
    settlingTimeout = setTimeout(stopSettling, SETTLE_DURATION_MS);
    setOffset(0);
  };

  // --- Controller ---

  let initialized = false;

  const init = () => {
    initialized = true;

    // Measured right away, so that scrolling can follow from the first frame
    applyHideHeight(measureHideHeight());

    lastScrollTop = scrollEl.scrollTop;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateHideHeight());
      resizeObserver.observe(el);
    }

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('focusin', handleFocusIn);

    contentEl.classList.add(contentPartnerClass);
  };

  const destroy = () => {
    if (!initialized) return;

    scrollEl.removeEventListener('scroll', handleScroll);
    el.removeEventListener('focusin', handleFocusIn);

    if (settleTimeout !== undefined) {
      clearTimeout(settleTimeout);
      settleTimeout = undefined;
    }
    stopSettling();

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = undefined;
    }

    contentEl.classList.remove(contentPartnerClass, contentHiddenClass);
    contentEl.style.removeProperty(cssVar);

    if (controllerIsHidden) {
      el.classList.remove(hiddenClass);
      controllerIsHidden = false;
    }
    el.style.removeProperty(cssVar);
    el.style.removeProperty(OFFSET_CSS_VAR);
    el.style.removeProperty(PROGRESS_CSS_VAR);
  };

  const isHidden = () => controllerIsHidden;

  return { isHidden, init, destroy };
};
