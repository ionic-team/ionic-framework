/**
 * Use y = mx + b to
 * figure out the backdrop value
 * at a particular x coordinate. This
 * is useful when the backdrop does
 * not begin to fade in until after
 * the 0 breakpoint.
 */
import { Animation, Gesture } from '../../interface';
import { raf } from '../../utils/helpers';

// Defaults for the sheet swipe animation
const defaultBackdrop = [
  { offset: 0, opacity: 'var(--backdrop-opacity)' },
  { offset: 1, opacity: 0.01 }
]

const customBackdrop = (backdropBreakpoint: number) => {
  return [
    { offset: 0, opacity: 'var(--backdrop-opacity)' },
    { offset: 1 - backdropBreakpoint, opacity: 0 },
    { offset: 1, opacity: 0 }
  ]
}

export const SheetAnimationDefaults = (backdropBreakpoint: number) => {
  return {
    WRAPPER_KEYFRAMES: [
      { offset: 0, transform: 'translateY(0%)' },
      { offset: 1, transform: 'translateY(100%)' }
    ],
    BACKDROP_KEYFRAMES: (backdropBreakpoint !== 0) ? customBackdrop(backdropBreakpoint) : defaultBackdrop
  }
};

export const getBackdropValueForSheet = (x: number, backdropBreakpoint: number) => {

  /**
   * We will use these points:
   * (backdropBreakpoint, 0)
   * (maxBreakpoint, 1)
   * We know that at the beginning breakpoint,
   * the backdrop will be hidden. We also
   * know that at the maxBreakpoint, the backdrop
   * must be fully visible. maxBreakpoint should
   * always be 1 even if the maximum value
   * of the breakpoints array is not 1 since
   * the animation runs from a progress of 0
   * to a progress of 1.
   * m = (y2 - y1) / (x2 - x1)
   *
   * This is simplified from:
   * m = (1 - 0) / (maxBreakpoint - backdropBreakpoint)
   */
  const slope = 1 / (1 - backdropBreakpoint);

  /**
   * From here, compute b which is
   * the backdrop opacity if the offset
   * is 0. If the backdrop does not
   * begin to fade in until after the
   * 0 breakpoint, this b value will be
   * negative. This is fine as we never pass
   * b directly into the animation keyframes.
   * b = y - mx
   * Use a known point: (backdropBreakpoint, 0)
   * This is simplified from:
   * b = 0 - (backdropBreakpoint * slope)
   */
  const b = -(backdropBreakpoint * slope);

  /**
   * Finally, we can now determine the
   * backdrop offset given an arbitrary
   * gesture offset.
   */

  return (x * slope) + b;
}

export const moveSheetToBreakpoint = (
  baseEl: HTMLIonModalElement,
  backdropEl: HTMLIonBackdropElement,
  animation: Animation,
  gesture: Gesture,
  breakpoints: number[],
  offset: number,
  newBreakpoint: number,
  backdropBreakpoint: number,
  onDismiss: () => void,
  onBreakpointChange: (breakpoint: number) => void
) => {
  const SheetDefaults = SheetAnimationDefaults(backdropBreakpoint);
  const contentEl = baseEl.querySelector('ion-content');

  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');
  const backdropAnimation = animation.childAnimations.find(ani => ani.id === 'backdropAnimation');

  const shouldRemainOpen = newBreakpoint !== 0;
  let currentBreakpoint = 0;

  /**
   * Update the animation so that it plays from
   * the current offset to the new breakpoint.
   */
  if (wrapperAnimation && backdropAnimation) {
    wrapperAnimation.keyframes([
      { offset: 0, transform: `translateY(${offset * 100}%)` },
      { offset: 1, transform: `translateY(${(1 - newBreakpoint) * 100}%)` }
    ]);

    backdropAnimation.keyframes([
      { offset: 0, opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(1 - offset, backdropBreakpoint)})` },
      { offset: 1, opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(newBreakpoint, backdropBreakpoint)})` }
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
            animation.progressStart(true, 1 - newBreakpoint);
            currentBreakpoint = newBreakpoint;
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
            baseEl.style.setProperty('pointer-events', backdropEnabled ? 'auto' : 'none');
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
}
