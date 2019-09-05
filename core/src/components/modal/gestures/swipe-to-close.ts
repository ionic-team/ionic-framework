import { IonicAnimation } from '../../../interface';
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
    if (step < 0.5) {
      animation.progressEnd(false, step, 200);
    } else {
      onDismiss(100);
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
