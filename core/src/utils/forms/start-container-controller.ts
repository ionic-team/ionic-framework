import { win } from '@utils/browser';
import { raf } from '@utils/helpers';
import { isRTL } from '@utils/rtl';

export const SKIP_LABEL_TRANSITION_CLASS = 'skip-label-transition';
export const START_CONTAINER_ADJUSTMENT_VAR = '--internal-start-container-adjustment';

/**
 * A utility to measure and update the start container width adjustment
 * for form components (input, textarea, select) with `fill="outline"`.
 * This adjustment compensates for the start container width when
 * positioning floating/stacked labels within the outline border.
 *
 * Measurement is deferred with raf() to avoid forcing layout during
 * component updates, and a ResizeObserver watches for dynamic width
 * changes (e.g., when web fonts load or async content changes).
 *
 * @internal
 * @param el - The host element (ion-input, ion-textarea, or ion-select).
 * @param getStartContainer - A callback that returns the start container element.
 * @param shouldApplyAdjustment - A callback that determines whether the adjustment should be applied.
 */
export const createStartContainerController = (
  el: HTMLElement,
  getStartContainer: () => HTMLElement | undefined,
  shouldApplyAdjustment: () => boolean
): StartContainerController => {
  let resizeObserver: ResizeObserver | undefined;
  let measurementRaf: number | undefined;

  const calculateAdjustment = (): string => {
    const startSlot = getStartContainer();
    if (!startSlot || !shouldApplyAdjustment()) {
      return '';
    }

    /*
     * Round to one decimal place so fractional widths produce a stable
     * label offset when the start container is added, removed, or resized.
     */
    const startContainerWidth = startSlot.getBoundingClientRect().width;
    const roundedWidth = Math.round(startContainerWidth * 10) / 10;
    const sign = isRTL(el) ? '' : '-';
    return roundedWidth ? `${sign}${roundedWidth}px` : '0px';
  };

  const scheduleAdjustmentUpdate = (onComplete?: () => void) => {
    // Cancel any pending measurement to avoid applying a stale adjustment
    if (measurementRaf !== undefined) {
      cancelAnimationFrame(measurementRaf);
    }

    /*
     * Defer the measurement until the next animation frame so layout
     * is measured after the current update has been applied.
     */
    measurementRaf = raf(() => {
      const adjustment = calculateAdjustment();
      el.style.setProperty(START_CONTAINER_ADJUSTMENT_VAR, adjustment);
      measurementRaf = undefined;
      onComplete?.();
    });
  };

  const setupResizeObserver = () => {
    const startSlot = getStartContainer();
    if (!startSlot || !shouldApplyAdjustment() || !win || typeof ResizeObserver !== 'function') {
      return;
    }

    // Disconnect any existing observer before creating a new one
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    resizeObserver = new ResizeObserver(() => {
      // Prevent the label transition while responding to a size change
      el.classList.add(SKIP_LABEL_TRANSITION_CLASS);

      scheduleAdjustmentUpdate(() => {
        el.classList.remove(SKIP_LABEL_TRANSITION_CLASS);
      });
    });

    resizeObserver.observe(startSlot);
  };

  const calculateStartContainerWidth = () => {
    // Disable transitions while measuring to avoid visual flicker
    el.classList.add(SKIP_LABEL_TRANSITION_CLASS);

    scheduleAdjustmentUpdate(() => {
      // Re-enable the label transition after the adjustment has been applied
      el.classList.remove(SKIP_LABEL_TRANSITION_CLASS);

      // Start observing the container for future size changes
      setupResizeObserver();
    });
  };

  const destroy = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = undefined;
    }

    if (measurementRaf !== undefined) {
      cancelAnimationFrame(measurementRaf);
      measurementRaf = undefined;
    }
  };

  return {
    calculateStartContainerWidth,
    destroy,
  };
};

export type StartContainerController = {
  calculateStartContainerWidth: () => void;
  destroy: () => void;
};
