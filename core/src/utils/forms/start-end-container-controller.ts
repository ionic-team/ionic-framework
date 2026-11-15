import { raf } from '@utils/helpers';
import { isRTL } from '@utils/rtl';

/**
 * Applied to the host while the label is being repositioned. The
 * component stylesheets style this class, so it must stay in sync with
 * the `skip-label-transition` selector in those files. Renaming it here
 * requires renaming it there too.
 */
export const SKIP_LABEL_TRANSITION_CLASS = 'skip-label-transition';

/**
 * Set on the host as an inline style. The component stylesheets declare
 * this property and read it with `var()`, so it must stay in sync with
 * the `--internal-start-container-adjustment` references in those files.
 * Renaming it here requires renaming it there too.
 */
export const START_CONTAINER_ADJUSTMENT_VAR = '--internal-start-container-adjustment';

/**
 * Set on the host as an inline style. The component stylesheets declare
 * this property and read it with `var()`, so it must stay in sync with
 * the `--internal-start-end-container-width` references in those files.
 * Renaming it here requires renaming it there too.
 */
export const START_END_CONTAINER_WIDTH_VAR = '--internal-start-end-container-width';

/**
 * A utility to measure the start and end containers of form components
 * (input, textarea, select) with `fill="outline"` and write the results
 * to the host. The start container width offsets floating/stacked labels
 * so they line up with the outline border. The combined start and end
 * container width lets the floating label size itself to the full width
 * of the outline while still being positioned relative to the control.
 *
 * Measurement is deferred with raf() to avoid forcing layout during
 * component updates, and a ResizeObserver watches for dynamic width
 * changes (e.g., when web fonts load or async content changes).
 *
 * @internal
 * @param el - The host element (ion-input, ion-textarea, or ion-select).
 * @param getStartContainer - A callback that returns the start container element.
 * @param getEndContainer - A callback that returns the end container element.
 * @param shouldMeasure - A callback that determines whether the containers should be measured.
 */
export const createStartEndContainerController = (
  el: HTMLElement,
  getStartContainer: () => HTMLElement | undefined,
  getEndContainer: () => HTMLElement | undefined,
  shouldMeasure: () => boolean
): StartEndContainerController => {
  let resizeObserver: ResizeObserver | undefined;
  let observedStartContainer: HTMLElement | undefined;
  let observedEndContainer: HTMLElement | undefined;
  let measurementRaf: number | undefined;
  let transitionRaf: number | undefined;
  let appliedAdjustment: string | undefined;
  let appliedStartEndWidth: string | undefined;

  /*
   * Round to one decimal place so fractional widths produce a stable
   * label offset and width when a container is added, removed, or resized.
   */
  const roundWidth = (width: number) => Math.round(width * 10) / 10;

  const measureContainers = (): { adjustment: string; startEndWidth: string } => {
    const startContainer = getStartContainer();
    if (!startContainer || !shouldMeasure()) {
      return { adjustment: '', startEndWidth: '' };
    }

    const startContainerWidth = roundWidth(startContainer.getBoundingClientRect().width);
    const endContainerWidth = roundWidth(getEndContainer()?.getBoundingClientRect().width ?? 0);
    const sign = isRTL(el) ? '' : '-';

    return {
      adjustment: startContainerWidth ? `${sign}${startContainerWidth}px` : '0px',
      startEndWidth: `${roundWidth(startContainerWidth + endContainerWidth)}px`,
    };
  };

  const scheduleMeasurement = () => {
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

      const { adjustment, startEndWidth } = measureContainers();

      /*
       * The width only changes how much of the label fits, so it can
       * animate. The transition is not suppressed here because the end
       * container can change size while the label is floating, such as
       * when async content loads, and that should not cut the float short.
       */
      if (startEndWidth !== appliedStartEndWidth) {
        el.style.setProperty(START_END_CONTAINER_WIDTH_VAR, startEndWidth);
        appliedStartEndWidth = startEndWidth;
      }

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
      observedStartContainer = undefined;
      observedEndContainer = undefined;
    }
  };

  const setupResizeObserver = () => {
    const startContainer = getStartContainer();
    const endContainer = getEndContainer();

    // Stop watching once the measurements no longer apply
    if (!startContainer || !shouldMeasure()) {
      disconnectResizeObserver();
      return;
    }

    // Return when prerendering or already watching these containers
    if (
      typeof ResizeObserver !== 'function' ||
      (resizeObserver && observedStartContainer === startContainer && observedEndContainer === endContainer)
    ) {
      return;
    }

    disconnectResizeObserver();

    resizeObserver = new ResizeObserver(() => {
      scheduleMeasurement();
    });

    observedStartContainer = startContainer;
    resizeObserver.observe(startContainer);

    if (endContainer) {
      observedEndContainer = endContainer;
      resizeObserver.observe(endContainer);
    }
  };

  const calculateContainerWidths = () => {
    scheduleMeasurement();
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
    appliedStartEndWidth = undefined;
  };

  return {
    calculateContainerWidths,
    destroy,
  };
};

export type StartEndContainerController = {
  calculateContainerWidths: () => void;
  destroy: () => void;
};
