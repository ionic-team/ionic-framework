import { isIonContent, findClosestIonContent } from '@utils/content';
import { createGesture } from '@utils/gesture';
import { clamp, raf, getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { GestureDetail } from '../../../utils/gesture';
import { getBackdropValueForSheet } from '../utils';

import { calculateSpringStep, handleCanDismiss } from './utils';

export interface MoveSheetToBreakpointOptions {
  /**
   * The breakpoint value to move the sheet to.
   */
  breakpoint: number;
  /**
   * The offset value between the current breakpoint and the new breakpoint.
   *
   * For breakpoint changes as a result of a touch gesture, this value
   * will be calculated internally.
   *
   * For breakpoint changes as a result of dynamically setting the value,
   * this value should be the difference between the new and old breakpoint.
   * For example:
   * - breakpoints: [0, 0.25, 0.5, 0.75, 1]
   * - Current breakpoint value is 1.
   * - Setting the breakpoint to 0.25.
   * - The offset value should be 0.75 (1 - 0.25).
   */
  breakpointOffset: number;
  /**
   * `true` if the sheet can be transitioned and dismissed off the view.
   */
  canDismiss?: boolean;

  /**
   * If `true`, the sheet will animate to the breakpoint.
   * If `false`, the sheet will jump directly to the breakpoint.
   */
  animated: boolean;
}

export const createSheetGesture = (
  baseEl: HTMLIonModalElement,
  backdropEl: HTMLIonBackdropElement,
  wrapperEl: HTMLElement,
  initialBreakpoint: number,
  backdropBreakpoint: number,
  animation: Animation,
  breakpoints: number[] = [],
  getCurrentBreakpoint: () => number,
  onDismiss: () => void,
  onBreakpointChange: (breakpoint: number) => void
) => {
  // Defaults for the sheet swipe animation
  const defaultBackdrop = [
    { offset: 0, opacity: 'var(--backdrop-opacity)' },
    { offset: 1, opacity: 0.01 },
  ];

  const customBackdrop = [
    { offset: 0, opacity: 'var(--backdrop-opacity)' },
    { offset: 1 - backdropBreakpoint, opacity: 0 },
    { offset: 1, opacity: 0 },
  ];

  const SheetDefaults = {
    WRAPPER_KEYFRAMES: [
      { offset: 0, transform: 'translateY(0%)' },
      { offset: 1, transform: 'translateY(100%)' },
    ],
    BACKDROP_KEYFRAMES: backdropBreakpoint !== 0 ? customBackdrop : defaultBackdrop,
  };

  const contentEl = baseEl.querySelector('ion-content');
  const height = wrapperEl.clientHeight;
  let currentBreakpoint = initialBreakpoint;
  let offset = 0;
  let canDismissBlocksGesture = false;
  const canDismissMaxStep = 0.95;
  const wrapperAnimation = animation.childAnimations.find((ani) => ani.id === 'wrapperAnimation');
  const backdropAnimation = animation.childAnimations.find((ani) => ani.id === 'backdropAnimation');
  const maxBreakpoint = breakpoints[breakpoints.length - 1];
  const minBreakpoint = breakpoints[0];

  const enableBackdrop = () => {
    baseEl.style.setProperty('pointer-events', 'auto');
    backdropEl.style.setProperty('pointer-events', 'auto');

    /**
     * When the backdrop is enabled, elements such
     * as inputs should not be focusable outside
     * the sheet.
     */
    baseEl.classList.remove('ion-disable-focus-trap');
  };

  const disableBackdrop = () => {
    baseEl.style.setProperty('pointer-events', 'none');
    backdropEl.style.setProperty('pointer-events', 'none');

    /**
     * When the backdrop is enabled, elements such
     * as inputs should not be focusable outside
     * the sheet.
     * Adding this class disables focus trapping
     * for the sheet temporarily.
     */
    baseEl.classList.add('ion-disable-focus-trap');
  };

  /**
   * After the entering animation completes,
   * we need to set the animation to go from
   * offset 0 to offset 1 so that users can
   * swipe in any direction. We then set the
   * animation offset to the current breakpoint
   * so there is no flickering.
   */
  if (wrapperAnimation && backdropAnimation) {
    wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
    backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
    animation.progressStart(true, 1 - currentBreakpoint);

    /**
     * If backdrop is not enabled, then content
     * behind modal should be clickable. To do this, we need
     * to remove pointer-events from ion-modal as a whole.
     * ion-backdrop and .modal-wrapper always have pointer-events: auto
     * applied, so the modal content can still be interacted with.
     */
    const shouldEnableBackdrop = currentBreakpoint > backdropBreakpoint;
    if (shouldEnableBackdrop) {
      enableBackdrop();
    } else {
      disableBackdrop();
    }
  }

  if (contentEl && currentBreakpoint !== maxBreakpoint) {
    contentEl.scrollY = false;
  }

  const canStart = (detail: GestureDetail) => {
    /**
     * If we are swiping on the content, swiping should only be possible if the content
     * is scrolled all the way to the top so that we do not interfere with scrolling.
     *
     * We cannot assume that the `ion-content` target will remain consistent between swipes.
     * For example, when using ion-nav within a modal it is possible to swipe, push a view,
     * and then swipe again. The target content will not be the same between swipes.
     */
    const contentEl = findClosestIonContent(detail.event.target! as HTMLElement);
    currentBreakpoint = getCurrentBreakpoint();

    if (currentBreakpoint === 1 && contentEl) {
      /**
       * The modal should never swipe to close on the content with a refresher.
       * Note 1: We cannot solve this by making this gesture have a higher priority than
       * the refresher gesture as the iOS native refresh gesture uses a scroll listener in
       * addition to a gesture.
       *
       * Note 2: Do not use getScrollElement here because we need this to be a synchronous
       * operation, and getScrollElement is asynchronous.
       */
      const scrollEl = isIonContent(contentEl) ? getElementRoot(contentEl).querySelector('.inner-scroll') : contentEl;
      const hasRefresherInContent = !!contentEl.querySelector('ion-refresher');
      return !hasRefresherInContent && scrollEl!.scrollTop === 0;
    }

    return true;
  };

  const onStart = (detail: GestureDetail) => {
    /**
     * If canDismiss is anything other than `true`
     * then users should be able to swipe down
     * until a threshold is hit. At that point,
     * the card modal should not proceed any further.
     *
     * canDismiss is never fired via gesture if there is
     * no 0 breakpoint. However, it can be fired if the user
     * presses Esc or the hardware back button.
     * TODO (FW-937)
     * Remove undefined check
     */
    canDismissBlocksGesture = baseEl.canDismiss !== undefined && baseEl.canDismiss !== true && minBreakpoint === 0;

    /**
     * If we are pulling down, then it is possible we are pulling on the content.
     * We do not want scrolling to happen at the same time as the gesture.
     */
    if (detail.deltaY > 0 && contentEl) {
      contentEl.scrollY = false;
    }

    raf(() => {
      /**
       * Dismisses the open keyboard when the sheet drag gesture is started.
       * Sets the focus onto the modal element.
       */
      baseEl.focus();
    });

    animation.progressStart(true, 1 - currentBreakpoint);
  };

  const onMove = (detail: GestureDetail) => {
    /**
     * If we are pulling down, then it is possible we are pulling on the content.
     * We do not want scrolling to happen at the same time as the gesture.
     * This accounts for when the user scrolls down, scrolls all the way up, and then
     * pulls down again such that the modal should start to move.
     */
    if (detail.deltaY > 0 && contentEl) {
      contentEl.scrollY = false;
    }

    /**
     * Given the change in gesture position on the Y axis,
     * compute where the offset of the animation should be
     * relative to where the user dragged.
     */
    const initialStep = 1 - currentBreakpoint;
    const secondToLastBreakpoint = breakpoints.length > 1 ? 1 - breakpoints[1] : undefined;
    const step = initialStep + detail.deltaY / height;
    const isAttemptingDismissWithCanDismiss =
      secondToLastBreakpoint !== undefined && step >= secondToLastBreakpoint && canDismissBlocksGesture;

    /**
     * If we are blocking the gesture from dismissing,
     * set the max step value so that the sheet cannot be
     * completely hidden.
     */
    const maxStep = isAttemptingDismissWithCanDismiss ? canDismissMaxStep : 0.9999;

    /**
     * If we are blocking the gesture from
     * dismissing, calculate the spring modifier value
     * this will be added to the starting breakpoint
     * value to give the gesture a spring-like feeling.
     * Note that when isAttemptingDismissWithCanDismiss is true,
     * the modifier is always added to the breakpoint that
     * appears right after the 0 breakpoint.
     *
     * Note that this modifier is essentially the progression
     * between secondToLastBreakpoint and maxStep which is
     * why we subtract secondToLastBreakpoint. This lets us get
     * the result as a value from 0 to 1.
     */
    const processedStep =
      isAttemptingDismissWithCanDismiss && secondToLastBreakpoint !== undefined
        ? secondToLastBreakpoint +
          calculateSpringStep((step - secondToLastBreakpoint) / (maxStep - secondToLastBreakpoint))
        : step;

    offset = clamp(0.0001, processedStep, maxStep);
    animation.progressStep(offset);
  };

  const onEnd = (detail: GestureDetail) => {
    /**
     * When the gesture releases, we need to determine
     * the closest breakpoint to snap to.
     */
    const velocity = detail.velocityY;
    const threshold = (detail.deltaY + velocity * 350) / height;

    const diff = currentBreakpoint - threshold;
    const closest = breakpoints.reduce((a, b) => {
      return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
    });

    moveSheetToBreakpoint({
      breakpoint: closest,
      breakpointOffset: offset,
      canDismiss: canDismissBlocksGesture,

      /**
       * The swipe is user-driven, so we should
       * always animate when the gesture ends.
       */
      animated: true,
    });
  };

  const moveSheetToBreakpoint = (options: MoveSheetToBreakpointOptions) => {
    const { breakpoint, canDismiss, breakpointOffset, animated } = options;
    /**
     * canDismiss should only prevent snapping
     * when users are trying to dismiss. If canDismiss
     * is present but the user is trying to swipe upwards,
     * we should allow that to happen,
     */
    const shouldPreventDismiss = canDismiss && breakpoint === 0;
    const snapToBreakpoint = shouldPreventDismiss ? currentBreakpoint : breakpoint;

    const shouldRemainOpen = snapToBreakpoint !== 0;

    currentBreakpoint = 0;
    /**
     * Update the animation so that it plays from
     * the last offset to the closest snap point.
     */
    if (wrapperAnimation && backdropAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: `translateY(${breakpointOffset * 100}%)` },
        { offset: 1, transform: `translateY(${(1 - snapToBreakpoint) * 100}%)` },
      ]);

      backdropAnimation.keyframes([
        {
          offset: 0,
          opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(
            1 - breakpointOffset,
            backdropBreakpoint
          )})`,
        },
        {
          offset: 1,
          opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(snapToBreakpoint, backdropBreakpoint)})`,
        },
      ]);

      animation.progressStep(0);
    }

    /**
     * Gesture should remain disabled until the
     * snapping animation completes.
     */
    gesture.enable(false);

    if (shouldPreventDismiss) {
      handleCanDismiss(baseEl, animation);
    } else if (!shouldRemainOpen) {
      onDismiss();
    }

    /**
     * If the sheet is going to be fully expanded then we should enable
     * scrolling immediately. The sheet modal animation takes ~500ms to finish
     * so if we wait until then there is a visible delay for when scrolling is
     * re-enabled. Native iOS allows for scrolling on the sheet modal as soon
     * as the gesture is released, so we align with that.
     */
    if (contentEl && snapToBreakpoint === breakpoints[breakpoints.length - 1]) {
      contentEl.scrollY = true;
    }

    return new Promise<void>((resolve) => {
      animation
        .onFinish(
          () => {
            if (shouldRemainOpen) {
              /**
               * Once the snapping animation completes,
               * we need to reset the animation to go
               * from 0 to 1 so users can swipe in any direction.
               * We then set the animation offset to the current
               * breakpoint so that it starts at the snapped position.
               */
              if (wrapperAnimation && backdropAnimation) {
                raf(() => {
                  wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
                  backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
                  animation.progressStart(true, 1 - snapToBreakpoint);
                  currentBreakpoint = snapToBreakpoint;
                  onBreakpointChange(currentBreakpoint);

                  /**
                   * Backdrop should become enabled
                   * after the backdropBreakpoint value
                   */
                  const shouldEnableBackdrop = currentBreakpoint > backdropBreakpoint;
                  if (shouldEnableBackdrop) {
                    enableBackdrop();
                  } else {
                    disableBackdrop();
                  }

                  gesture.enable(true);
                  resolve();
                });
              } else {
                gesture.enable(true);
                resolve();
              }
            } else {
              resolve();
            }

            /**
             * This must be a one time callback
             * otherwise a new callback will
             * be added every time onEnd runs.
             */
          },
          { oneTimeCallback: true }
        )
        .progressEnd(1, 0, animated ? 500 : 0);
    });
  };

  const gesture = createGesture({
    el: wrapperEl,
    gestureName: 'modalSheet',
    gesturePriority: 40,
    direction: 'y',
    threshold: 10,
    canStart,
    onStart,
    onMove,
    onEnd,
  });

  return {
    gesture,
    moveSheetToBreakpoint,
  };
};
