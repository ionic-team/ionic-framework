import { readTask, writeTask } from '@stencil/core';

/** Cumulative downward delta before hiding (header or footer `collapse="hide"`). */
export const COLLAPSE_HIDE_THRESHOLD_PX = 24;

/**
 * Cumulative upward delta before showing again after hide. Small bias
 * (instead of "any upward delta") guards against inertial-scroll
 * oscillation flicking the region back open during a downward gesture.
 */
export const COLLAPSE_SHOW_THRESHOLD_PX = 5;

const WHEEL_SCROLL_SUPPRESS_MS = 80;

export interface CollapseHideInteractionConfig {
  regionEl: HTMLElement;
  scrollEl: HTMLElement;
  /** Custom property set on the region and on `ion-content` (e.g. `--header-hide-slide-y`). */
  slideCssVar: string;
  contentPartnerClass: string;
  contentHiddenClass: string;
  regionHiddenClass: string;
}

const getContentHostFromScrollEl = (scrollEl: HTMLElement): HTMLElement | null => {
  const root = scrollEl.getRootNode();
  if (root instanceof ShadowRoot && root.host instanceof HTMLElement) {
    return root.host as HTMLElement;
  }
  // Light-DOM fallback: the scroll element may live inside a non-shadow
  // ion-content (e.g. custom scroll host). Walk up to the nearest ion-content.
  return scrollEl.closest('ion-content');
};

const applySlideDistance = (
  regionEl: HTMLElement,
  contentHost: HTMLElement | null,
  slideCssVar: string,
  heightPx: number
) => {
  const value = `${Math.max(0, Math.ceil(heightPx))}px`;
  regionEl.style.setProperty(slideCssVar, value);
  contentHost?.style.setProperty(slideCssVar, value);
};

const clearSlideDistance = (regionEl: HTMLElement, contentHost: HTMLElement | null, slideCssVar: string) => {
  regionEl.style.removeProperty(slideCssVar);
  contentHost?.style.removeProperty(slideCssVar);
};

/**
 * Scroll/wheel-driven hide/show for `collapse="hide"` on `ion-header` or `ion-footer`.
 * Hide after {@link COLLAPSE_HIDE_THRESHOLD_PX}px cumulative downward delta; show after
 * {@link COLLAPSE_SHOW_THRESHOLD_PX}px cumulative upward delta. Each direction drains
 * (not resets) the opposing accumulator so inertial-scroll jitter doesn't stall either
 * transition. Motion is defined in component SCSS and `content.scss`; this toggles
 * classes and syncs the slide distance CSS var.
 */
export const createCollapseHideInteraction = ({
  regionEl,
  scrollEl,
  slideCssVar,
  contentPartnerClass,
  contentHiddenClass,
  regionHiddenClass,
}: CollapseHideInteractionConfig): (() => void) => {
  const contentHost = getContentHostFromScrollEl(scrollEl);
  if (contentHost !== null) {
    contentHost.classList.add(contentPartnerClass);
  }

  let resizeObserver: ResizeObserver | undefined;
  let destroyed = false;

  const syncSlideDistance = () => {
    readTask(() => {
      if (destroyed) {
        return;
      }
      const heightPx = regionEl.offsetHeight;
      writeTask(() => {
        if (destroyed) {
          return;
        }
        applySlideDistance(regionEl, contentHost, slideCssVar, heightPx);
      });
    });
  };

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      syncSlideDistance();
    });
    resizeObserver.observe(regionEl);
  }

  syncSlideDistance();
  requestAnimationFrame(() => {
    if (!destroyed) {
      syncSlideDistance();
    }
  });

  let hidden = false;
  let accDown = 0;
  let accUp = 0;
  let lastScrollTop = scrollEl.scrollTop;
  let lastWheelTime = 0;

  const setHidden = (next: boolean) => {
    if (hidden === next || destroyed) {
      return;
    }
    hidden = next;
    // When transitioning to hidden, re-measure synchronously in case the
    // initial layout reported offsetHeight === 0 (e.g. mid page transition).
    // Without this the slide animates by 0px and only opacity fades.
    if (hidden) {
      const heightPx = regionEl.offsetHeight;
      if (heightPx > 0) {
        applySlideDistance(regionEl, contentHost, slideCssVar, heightPx);
      }
    }
    writeTask(() => {
      if (destroyed) {
        return;
      }
      regionEl.classList.toggle(regionHiddenClass, hidden);
      contentHost?.classList.toggle(contentHiddenClass, hidden);
      if (hidden) {
        // `inert` removes the subtree from the tab order and AT, AND moves
        // focus out automatically in supporting browsers. `aria-hidden` is
        // kept as a fallback for older engines without `inert` support.
        regionEl.setAttribute('inert', '');
        regionEl.setAttribute('aria-hidden', 'true');
      } else {
        regionEl.removeAttribute('inert');
        regionEl.removeAttribute('aria-hidden');
      }
    });
  };

  // Accumulate cumulative movement in each direction. The OPPOSITE accumulator
  // is drained (not reset) by each event, so brief inertial jitter does not
  // wipe a sustained gesture's accumulation. Crossing a threshold resets both.
  const processDelta = (delta: number) => {
    if (delta > 0) {
      accUp = Math.max(0, accUp - delta);
      accDown += delta;
      if (accDown >= COLLAPSE_HIDE_THRESHOLD_PX) {
        setHidden(true);
        accDown = 0;
        accUp = 0;
      }
    } else if (delta < 0) {
      const mag = -delta;
      accDown = Math.max(0, accDown - mag);
      accUp += mag;
      if (accUp >= COLLAPSE_SHOW_THRESHOLD_PX) {
        setHidden(false);
        accUp = 0;
        accDown = 0;
      }
    }
  };

  const onWheel = (ev: WheelEvent) => {
    if (destroyed) {
      return;
    }
    lastWheelTime = performance.now();
    processDelta(ev.deltaY);
  };

  const onScroll = () => {
    if (destroyed) {
      return;
    }
    const st = scrollEl.scrollTop;
    if (performance.now() - lastWheelTime < WHEEL_SCROLL_SUPPRESS_MS) {
      lastScrollTop = st;
      return;
    }
    const delta = st - lastScrollTop;
    lastScrollTop = st;
    processDelta(delta);
  };

  scrollEl.addEventListener('wheel', onWheel, { passive: true });
  scrollEl.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    destroyed = true;
    resizeObserver?.disconnect();
    scrollEl.removeEventListener('wheel', onWheel);
    scrollEl.removeEventListener('scroll', onScroll);
    regionEl.classList.remove(regionHiddenClass);
    regionEl.removeAttribute('inert');
    regionEl.removeAttribute('aria-hidden');
    contentHost?.classList.remove(contentPartnerClass, contentHiddenClass);
    clearSlideDistance(regionEl, contentHost, slideCssVar);
  };
};
