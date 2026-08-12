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
  let observedContainer: HTMLElement | undefined;
  let measurementRaf: number | undefined;
  let transitionRaf: number | undefined;
  let appliedAdjustment: string | undefined;

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

  const scheduleAdjustmentUpdate = () => {
    // Return if there is already a measurement queued to avoid a flicker
    if (measurementRaf !== undefined) {
      return;
    }

    /*
     * Defer the measurement until the next animation frame so layout
     * is measured after the current update has been applied.
     */
    measurementRaf = raf(() => {
      measurementRaf = undefined;

      const adjustment = calculateAdjustment();

      // Only suppress the label transition when the label has to move
      if (adjustment !== appliedAdjustment) {
        // Discard a removal queued by an earlier change
        if (transitionRaf !== undefined) {
          cancelAnimationFrame(transitionRaf);
        }

        el.classList.add(SKIP_LABEL_TRANSITION_CLASS);
        el.style.setProperty(START_CONTAINER_ADJUSTMENT_VAR, adjustment);
        appliedAdjustment = adjustment;

        // Re-enable the transition once the new offset has been painted
        transitionRaf = raf(() => {
          transitionRaf = undefined;
          el.classList.remove(SKIP_LABEL_TRANSITION_CLASS);
        });
      }

      setupResizeObserver();
    });
  };

  const disconnectResizeObserver = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = undefined;
      observedContainer = undefined;
    }
  };

  const setupResizeObserver = () => {
    const startSlot = getStartContainer();

    // Stop watching once the adjustment no longer applies
    if (!startSlot || !shouldApplyAdjustment()) {
      disconnectResizeObserver();
      return;
    }

    // Return when prerendering or already watching this container
    if (typeof ResizeObserver !== 'function' || (resizeObserver && observedContainer === startSlot)) {
      return;
    }

    disconnectResizeObserver();

    resizeObserver = new ResizeObserver(() => {
      scheduleAdjustmentUpdate();
    });

    observedContainer = startSlot;
    resizeObserver.observe(startSlot);
  };

  const calculateStartContainerWidth = () => {
    scheduleAdjustmentUpdate();
  };

  const destroy = () => {
    disconnectResizeObserver();

    if (measurementRaf !== undefined) {
      cancelAnimationFrame(measurementRaf);
      measurementRaf = undefined;
    }

    // Tearing down mid-toggle would leave the transition disabled
    if (transitionRaf !== undefined) {
      cancelAnimationFrame(transitionRaf);
      transitionRaf = undefined;
      el.classList.remove(SKIP_LABEL_TRANSITION_CLASS);
    }

    // Re-apply from scratch if the element is connected again
    appliedAdjustment = undefined;
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
