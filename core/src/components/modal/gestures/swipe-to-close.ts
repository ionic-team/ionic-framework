import { Animation } from '../../../interface';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp } from '../../../utils/helpers';

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
  animation: Animation,
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
    animation.easing('linear');
    animation.progressStart(false);
  };

  const onMove = (detail: GestureDetail) => {
    const step = Math.max(0, detail.deltaY / height);
    animation.progressStep(step);
  };

  const onEnd = (detail: GestureDetail) => {
    const velocity = detail.velocityY;
    const step = Math.max(0, (detail.deltaY / height));
    const threshold = (detail.deltaY + velocity * 1000) / height;

    // if (!shouldComplete) {
    //   animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
    //   newStepValue += getTimeGivenProgression(new Point(0, 0), new Point(1, 0), new Point(0.68, 0.28), new Point(1, 1), step);
    // } else {
    //   newStepValue += getTimeGivenProgression(new Point(0, 0), new Point(0.32, 0.72), new Point(0, 1), new Point(1, 1), step);
    // }
    if (threshold >= 0.5) {
      const duration = computeDuration(step * height, velocity);
      onDismiss(duration);
    } else {
      const duration = computeDuration((1 - step) * height, velocity);
      animation.progressEnd(0, step, duration);
    }
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

const computeDuration = (remaining: number, velocity: number) => {
  return clamp(100, remaining / Math.abs(velocity * 1.1), 400);
};
