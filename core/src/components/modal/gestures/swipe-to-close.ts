import { IonicAnimation } from '../../../interface';
import { Point, getTimeGivenProgression } from '../../../utils/animation/cubic-bezier';
import { GestureDetail, createGesture } from '../../../utils/gesture';

// Defaults for the card swipe animation
export const SwipeToCloseDefaults = {
  MIN_BACKDROP_OPACITY: 0.4,
  MIN_PRESENTING_SCALE: 0.95,
  MIN_Y_CARD: 44,
  MIN_Y_FULLSCREEN: 0,
  MIN_PRESENTING_Y: 0
};

export const createSwipeToCloseGesture = (
  el: HTMLIonModalElement,
  animation: IonicAnimation,
  onDismiss: (velocityY: number) => void
) => {
  const height = el.offsetHeight;

  const canStart = (detail: GestureDetail) => {
    const target = detail.event.target as HTMLElement | null;

    if (target === null ||
       !(target as any).closest) {
      return true;
    }

    const content = target.closest('ion-content');
    if (content === null) {
      return true;
    }
    // Target is in the content so we don't start the gesture.
    // We could be more nuanced here and allow it for content that
    // does not need to scroll.
    return false;
  };

  const onStart = () => {
    animation.progressStart(true);
  };

  const onMove = (detail: GestureDetail) => {
    const step = detail.deltaY / height;
    animation.progressStep(step);
  };

  const onEnd = (detail: GestureDetail) => {
    const step = detail.deltaY / height;

    /**
     * Animation will be reversed here, so need to
     * reverse the easing curve as well
     *
     * Additionally, we need to account for the time relative
     * to the new easing curve, as `stepValue` is going to be given
     * in terms of a linear curve.
     */

    const shouldComplete = step >= 0.5;
    let newStepValue = (shouldComplete) ? -0.001 : 0.001;

    if (!shouldComplete) {
      animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
      newStepValue += getTimeGivenProgression(new Point(0, 0), new Point(1, 0), new Point(0.68, 0.28), new Point(1, 1), step);
    } else {
      newStepValue += getTimeGivenProgression(new Point(0, 0), new Point(0.32, 0.72), new Point(0, 1), new Point(1, 1), step);
    }

    animation
      .progressEnd((shouldComplete) ? 'end' : 'start', newStepValue, (shouldComplete) ? 100 : 200)
      .onFinish(() => {
        // TODO this is a bit hacky, need to figure this out
        if (shouldComplete) {
          onDismiss(0);
        } else {
          animation.pause().easing('cubic-bezier(0.32, 0.72, 0, 1)');
        }
      });
    };

  return createGesture({
    el,
    gestureName: 'modalSwipeToClose',
    gesturePriority: 40,
    direction: 'y',
    threshold: 10,
    canStart,
    onStart,
    onMove,
    onEnd
  });
};
