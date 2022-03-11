import { Animation } from '../../../interface';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp, raf } from '../../../utils/helpers';
import type { Modal } from '../modal';
import { SheetAnimationDefaults, disableSheetBackdrop, enableSheetBackdrop, moveSheetToBreakpoint } from '../utils';

export const createSheetGesture = (
  modalEl: Modal,
  backdropEl: HTMLIonBackdropElement,
  wrapperEl: HTMLElement,
  backdropBreakpoint: number,
  animation: Animation,
  onDismiss: () => void,
  onBreakpointChange: (breakpoint: number) => void
) => {
  const SheetDefaults = SheetAnimationDefaults(backdropBreakpoint);

  const baseEl = modalEl.el;
  const contentEl = baseEl.querySelector('ion-content');
  const height = wrapperEl.clientHeight;
  let currentBreakpoint = modalEl.initialBreakpoint!;
  let offset = 0;
  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');
  const backdropAnimation = animation.childAnimations.find(ani => ani.id === 'backdropAnimation');

  let breakpoints = (modalEl.breakpoints?.sort((a, b) => a - b)) || [];
  const maxBreakpoint = breakpoints[breakpoints.length - 1];

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
      enableSheetBackdrop(baseEl, backdropEl);
    } else {
      disableSheetBackdrop(baseEl, backdropEl);
    }
  }

  if (contentEl && currentBreakpoint !== maxBreakpoint) {
    contentEl.scrollY = false;
  }

  const canStart = (detail: GestureDetail) => {
    /**
     * If the sheet is fully expanded and
     * the user is swiping on the content,
     * the gesture should not start to
     * allow for scrolling on the content.
     */
    const content = (detail.event.target! as HTMLElement).closest('ion-content');
    breakpoints = (modalEl.breakpoints?.sort((a, b) => a - b)) || [];
    currentBreakpoint = modalEl.currentBreakpoint!;

    if (currentBreakpoint === 1 && content) {
      return false;
    }

    return true;
  };

  const onStart = () => {
    /**
     * If swiping on the content
     * we should disable scrolling otherwise
     * the sheet will expand and the content will scroll.
     */
    if (contentEl) {
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
     * Given the change in gesture position on the Y axis,
     * compute where the offset of the animation should be
     * relative to where the user dragged.
     */
    const initialStep = 1 - currentBreakpoint;
    offset = clamp(0.0001, initialStep + (detail.deltaY / height), 0.9999);
    animation.progressStep(offset);
  };

  const onEnd = (detail: GestureDetail) => {
    /**
     * When the gesture releases, we need to determine
     * the closest breakpoint to snap to.
     */
    const velocity = detail.velocityY;
    const threshold = (detail.deltaY + velocity * 100) / height;
    const diff = currentBreakpoint - threshold;

    const closest = breakpoints.reduce((a, b) => {
      return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
    });

    if (closest !== currentBreakpoint) {
      modalEl.breakpointWillChange.emit({ breakpoint: closest });
      modalEl.breakpointWillChangeShorthand.emit({ breakpoint: closest });
    }

    currentBreakpoint = 0;

    moveSheetToBreakpoint(baseEl, backdropEl, animation, gesture, breakpoints, offset, closest, backdropBreakpoint, onDismiss, onBreakpointChange);
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
    onEnd
  });
  return gesture;
};
