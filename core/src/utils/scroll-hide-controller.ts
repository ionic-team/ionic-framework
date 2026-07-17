import { readTask, writeTask } from '@stencil/core';

const TOP_VISIBLE_THRESHOLD = 80;
const SCROLL_HIDE_THRESHOLD = 60;
const WHEEL_SUPPRESS_DURATION_MS = 80;
const SUPPRESS_SHOW_DURATION_MS = 400;

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
 * @internal
 * @param scrollEl The scrollable element to listen on.
 * @param onHiddenChange Callback invoked inside a writeTask when visibility changes.
 */
export const createScrollHideController = (
  scrollEl: HTMLElement,
  onHiddenChange: (hidden: boolean) => void
): ScrollHideController => {
  let isHidden = false;
  let lastScrollPosition = 0;
  // Where the user last changed scroll direction. We measure distance
  // from here to decide whether to commit to hiding or showing.
  let scrollPositionAtDirectionChange = 0;
  let lastWheelEventTimestamp = 0;
  let suppressShowUntil = 0;

  const handleWheel = (wheelEvent: WheelEvent) => {
    lastWheelEventTimestamp = Date.now();

    readTask(() => {
      const currentScrollTop = scrollEl.scrollTop;

      if (currentScrollTop <= TOP_VISIBLE_THRESHOLD) {
        if (isHidden) {
          writeTask(() => setHidden(false));
        }
        return;
      }

      if (wheelEvent.deltaY < 0) {
        scrollPositionAtDirectionChange = currentScrollTop;
        if (isHidden) {
          writeTask(() => setHidden(false));
        }
      } else if (wheelEvent.deltaY > 0) {
        const scrolledSinceDirectionChange = currentScrollTop - scrollPositionAtDirectionChange;
        if (scrolledSinceDirectionChange >= SCROLL_HIDE_THRESHOLD && !isHidden) {
          writeTask(() => setHidden(true));
        }
      }
    });
  };

  const handleScroll = () => {
    // Suppress scroll events shortly after a wheel event — delta already processed via wheel
    if (Date.now() - lastWheelEventTimestamp < WHEEL_SUPPRESS_DURATION_MS) {
      return;
    }

    readTask(() => {
      const currentScrollTop = scrollEl.scrollTop;

      if (currentScrollTop <= TOP_VISIBLE_THRESHOLD) {
        if (isHidden) {
          writeTask(() => setHidden(false));
        }
        lastScrollPosition = currentScrollTop;
        return;
      }

      // No movement — skip to avoid toggling state on duplicate scroll events
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
      if (shouldHide !== isHidden) {
        // After hiding, the content height increases (CSS transition), which lowers
        // max scrollTop and triggers a spurious upward-scroll event. Suppress "show"
        // actions briefly to absorb that adjustment.
        if (!shouldHide && Date.now() < suppressShowUntil) {
          return;
        }
        writeTask(() => setHidden(shouldHide));
      }
    });
  };

  const setHidden = (hidden: boolean) => {
    isHidden = hidden;
    if (hidden) {
      suppressShowUntil = Date.now() + SUPPRESS_SHOW_DURATION_MS;
    } else {
      suppressShowUntil = 0;
    }
    onHiddenChange(hidden);
  };

  scrollEl.addEventListener('scroll', handleScroll, { passive: true });
  scrollEl.addEventListener('wheel', handleWheel as EventListener, { passive: true });

  const destroy = () => {
    scrollEl.removeEventListener('scroll', handleScroll);
    scrollEl.removeEventListener('wheel', handleWheel as EventListener);

    isHidden = false;
    lastScrollPosition = 0;
    scrollPositionAtDirectionChange = 0;
    lastWheelEventTimestamp = 0;
    suppressShowUntil = 0;
  };

  return { destroy };
};

export type ScrollHideController = {
  destroy: () => void;
};
