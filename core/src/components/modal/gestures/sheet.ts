import { Animation } from '../../../interface';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp, raf } from '../../../utils/helpers';
import { getBackdropValueForSheet } from '../utils';

export const createSheetGesture = (
  baseEl: HTMLIonModalElement,
  backdropEl: HTMLIonBackdropElement,
  wrapperEl: HTMLElement,
  initialBreakpoint: number,
  backdropBreakpoint: number,
  animation: Animation,
  breakpoints: number[] = [],
  onDismiss: () => void,
  onBreakpointChange: (breakpoint: number) => void
) => {
  // Defaults for the sheet swipe animation
  const defaultBackdrop = [
    { offset: 0, opacity: 'var(--backdrop-opacity)' },
    { offset: 1, opacity: 0.01 }
  ]

  const customBackdrop = [
    { offset: 0, opacity: 'var(--backdrop-opacity)' },
    { offset: 1 - backdropBreakpoint, opacity: 0 },
    { offset: 1, opacity: 0 }
  ]

  const SheetDefaults = {
    WRAPPER_KEYFRAMES: [
      { offset: 0, transform: 'translateY(0%)' },
      { offset: 1, transform: 'translateY(100%)' }
    ],
    BACKDROP_KEYFRAMES: (backdropBreakpoint !== 0) ? customBackdrop : defaultBackdrop
  };

  const contentEl = baseEl.querySelector('ion-content');
  const height = wrapperEl.clientHeight;
  let currentBreakpoint = initialBreakpoint;
  let offset = 0;
  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');
  const backdropAnimation = animation.childAnimations.find(ani => ani.id === 'backdropAnimation');
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
     * Backdrop should become enabled
     * after the backdropBreakpoint value
     */
    const backdropEnabled = currentBreakpoint > backdropBreakpoint
    backdropEl.style.setProperty('pointer-events', backdropEnabled ? 'auto' : 'none');
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

    const shouldRemainOpen = closest !== 0;
    currentBreakpoint = 0;

    /**
     * Update the animation so that it plays from
     * the last offset to the closest snap point.
     */
    if (wrapperAnimation && backdropAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: `translateY(${offset * 100}%)` },
        { offset: 1, transform: `translateY(${(1 - closest) * 100}%)` }
      ]);

      backdropAnimation.keyframes([
        { offset: 0, opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(1 - offset, backdropBreakpoint)})` },
        { offset: 1, opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(closest, backdropBreakpoint)})` }
      ]);

      animation.progressStep(0);
    }

    /**
     * Gesture should remain disabled until the
     * snapping animation completes.
     */
    gesture.enable(false);

    animation
      .onFinish(() => {
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
              animation.progressStart(true, 1 - closest);
              currentBreakpoint = closest;
              onBreakpointChange(currentBreakpoint);

              /**
               * If the sheet is fully expanded, we can safely
               * enable scrolling again.
               */
              if (contentEl && currentBreakpoint === breakpoints[breakpoints.length - 1]) {
                contentEl.scrollY = true;
              }

              /**
               * Backdrop should become enabled
               * after the backdropBreakpoint value
               */
              const backdropEnabled = currentBreakpoint > backdropBreakpoint;
              backdropEl.style.setProperty('pointer-events', backdropEnabled ? 'auto' : 'none');

              gesture.enable(true);
            });
          } else {
            gesture.enable(true);
          }
        }

      /**
       * This must be a one time callback
       * otherwise a new callback will
       * be added every time onEnd runs.
       */
      }, { oneTimeCallback: true })
      .progressEnd(1, 0, 500);

    if (!shouldRemainOpen) {
      onDismiss();
    }
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
