import { getElementRoot } from '@utils/helpers';
import { createGesture } from '@utils/gesture';
import { createAnimation } from '@utils/animation/animation';
import type { GestureDetail } from '@utils/gesture';
import type { ToastAnimationPosition } from '../toast-interface';

export const createSwipeToDismissGesture = (
  el: HTMLIonToastElement,
  toastPosition: ToastAnimationPosition,
  onDismiss: () => void
) => {
  /**
   * Users should swipe on the visible toast wrapper
   * rather than on ion-toast which covers the entire screen.
   */
  const wrapperEl = getElementRoot(el).querySelector('.toast-wrapper')!;

  // TODO can this be a util function so the gesture + ios/md animations can reuse?
  const topPosition = Math.floor(el.clientHeight / 2 - wrapperEl.clientHeight / 2);

  /**
   * This is the maximum amount that
   * the toast can be swiped. For top/bottom
   * positions this is the wrapper height since
   * the toast appears at the top or bottom
   * edge of the screen. For middle position this is
   * the height of the screen plus the height
   * of the toast since the toast can move up or down.
   * We account for the toast height so the toast moves
   * off screen when swiping up (otherwise it would
   * stop at the top of the screen).
   */
  const wrapperElHeight = wrapperEl.clientHeight;
  const MAX_SWIPE_DISTANCE = el.position === 'middle' ? el.clientHeight + wrapperElHeight : wrapperElHeight;
  /**
   * The step value at which a toast
   * is eligible for dismissing via gesture.
   */
  const DISMISS_THRESHOLD = 0.5;

  /**
   * The middle position Toast starts 50% of the way
   * through the animation, so we need to use this
   * as the starting point for our step values.
   */
  const STEP_OFFSET = el.position === 'middle' ? 0.5 : 0;

  /**
   * When the Toast is at the top users will be
   * swiping up. As a result, the delta values will be
   * negative numbers which will result in negative steps
   * and thresholds. As a result, we need to make those numbers
   * positive.
   */
  const INVERSION_FACTOR = el.position === 'top' ? -1 : 1;

  const SWIPE_DOWN_KEYFRAMES = [
    { offset: 0, transform: `translateY(${toastPosition.bottom})` },
    { offset: 1, transform: 'translateY(100%) ' },
  ];

  const SWIPE_UP_KEYFRAMES = [
    { offset: 0, transform: `translateY(${toastPosition.top})` },
    { offset: 1, transform: 'translateY(-100%) ' },
  ];

  const SWIPE_UP_DOWN_KEYFRAMES = [
    { offset: 0, transform: `translateY(-${topPosition + wrapperElHeight}px)` },
    { offset: 0.5, transform: `translateY(0px)` },
    { offset: 1, transform: `translateY(${topPosition + wrapperElHeight}px)` },
  ];

  const swipeAnimation = createAnimation('toast-swipe-to-dismiss-animation')
    .addElement(wrapperEl)
    /**
     * The specific value here does not actually
     * matter. We just need this to be a positive
     * value so the animation does not jump
     * to the end when the user beings to drag.
     */
    .duration(100);

  switch (el.position) {
    case 'middle':
      swipeAnimation.keyframes(SWIPE_UP_DOWN_KEYFRAMES);
      /**
       * Toast can be swiped up or down but
       * should start in the middle of the screen.
       */
      swipeAnimation.progressStart(true, 0.5);
      break;
    case 'top':
      swipeAnimation.keyframes(SWIPE_UP_KEYFRAMES);
      swipeAnimation.progressStart(true, 0);
      break;
    case 'bottom':
    default:
      swipeAnimation.keyframes(SWIPE_DOWN_KEYFRAMES);
      swipeAnimation.progressStart(true, 0);
      break;
  }

  const computeStep = (delta: number) => {
    return (delta * INVERSION_FACTOR) / MAX_SWIPE_DISTANCE;
  };

  const onMove = (detail: GestureDetail) => {
    const step = STEP_OFFSET + computeStep(detail.deltaY);
    swipeAnimation.progressStep(step);
  };

  const onEnd = (detail: GestureDetail) => {
    const velocity = detail.velocityY;
    const threshold = ((detail.deltaY + velocity * 1000) / MAX_SWIPE_DISTANCE) * INVERSION_FACTOR;

    // TODO Figure out a good duration
    const duration = 500;

    /**
     * Disable the gesture for the remainder of the animation.
     * It will be re-enabled if the toast animates back to
     * its initial presented position.
     */
    gesture.enable(false);

    let shouldDismiss = true;
    let playTo: 0 | 1 = 1;
    let step: number = 0;

    if (el.position === 'middle') {
      /**
       * A middle positioned Toast appears
       * in the middle of the screen (at animation offset 0.5).
       * As a result, the threshold will be calculated relative
       * to this starting position. In other words at animation offset 0.5
       * the threshold will be 0. We want the middle Toast to be eligible
       * for dismiss when the user has swiped either half way up or down the
       * screen. As a result, we divide DISMISS_THRESHOLD in half. We also
       * consider when the threshold is a negative in the event the
       * user drags up (since the deltaY will also be negative).
       */
      shouldDismiss = threshold >= (DISMISS_THRESHOLD / 2) || threshold <= (-DISMISS_THRESHOLD / 2);
      /**
       * Since we are replacing the keyframes
       * below the animation always starts from
       * the beginning of the new keyframes.
       * Similarly, we are always playing to
       * the end of the new keyframes.
       */
      playTo = 1;
      step = 0;

      /**
       * The Toast should animate from wherever its
       * current position is to the desired end state.
       *
       * To begin, we get the current position of the
       * Toast for its starting state.
       */
      const wrapperElBox = wrapperEl.getBoundingClientRect();
      const startPosition = `${wrapperElBox.top - topPosition}px`;

      /**
       * By default, the Toast will come
       * back to its default state in the
       * middle of the screen.
       */
      let endPosition = '0px';

      /**
       * However, if the Toast should dismiss
       * then we need to figure out which edge of
       * the screen it should animate towards.
       */
      if (shouldDismiss) {
        const endOffset = topPosition + wrapperElHeight;
        /**
         * If the deltaY is negative then the user is swiping
         * up, so the Toast should animate to the top of the screen.
         * If the deltaY is positive then the user is swiping
         * down, so the Toast should animate to the bottom of the screen.
         * We also account for when the deltaY is 0, but realistically
         * that should never happen because it means the user did not drag
         * the toast.
         */
        endPosition = detail.deltaY <= 0 ? `-${endOffset}px` : `${endOffset}px`;
      }

      const KEYFRAMES = [
        { offset: 0, transform: `translateY(${startPosition})` },
        { offset: 1, transform: `translateY(${endPosition})` }
      ]

      swipeAnimation.keyframes(KEYFRAMES);
    } else {
      shouldDismiss = threshold >= DISMISS_THRESHOLD;
      playTo = shouldDismiss ? 1 : 0;
      step = computeStep(detail.deltaY);
    }

    swipeAnimation
      .onFinish(
        () => {
          if (shouldDismiss) {
            onDismiss();
            swipeAnimation.destroy();
          } else {
            if (el.position === 'middle') {
              /**
               * If the toast snapped back to
               * the middle of the screen we need
               * to reset the keyframes
               * so the toast can be swiped
               * up or down again.
               */
              swipeAnimation
                .keyframes(SWIPE_UP_DOWN_KEYFRAMES)
                .progressStart(true, 0.5);
            } else {
              swipeAnimation.progressStart(true, 0);
            }

            /**
             * If the toast did not dismiss then
             * the user should be able to swipe again.
             */
            gesture.enable(true);
          }

          /**
           * This must be a one time callback
           * otherwise a new callback will
           * be added every time onEnd runs.
           */
        },
        { oneTimeCallback: true }
      )
    .progressEnd(playTo, step, duration);
  };

  const gesture = createGesture({
    el: wrapperEl,
    gestureName: 'toast-swipe-to-dismiss',
    gesturePriority: 39, // TODO Figure out an appropriate priority
    /**
     * Toast only supports vertical swipes.
     * This needs to be updated if we later
     * support horizontal swipes.
     */
    direction: 'y',
    onMove,
    onEnd,
  });

  return gesture;
};
