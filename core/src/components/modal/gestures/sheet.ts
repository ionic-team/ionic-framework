import { Animation } from '../../../interface';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp } from '../../../utils/helpers';

// Defaults for the card swipe animation
export const SheetDefaults = {
  MIN_PRESENTING_SCALE: 0.93,
};

// TODO
let offset = 0;
// const base = 0;
// const breakpoints = [0, .5, 1];

export const createSheetGesture = (
  el: HTMLIonModalElement,
  animation: Animation,
  onDismiss: () => void
) => {
  const height = window.innerHeight;
  let currentBreakpoint = el.initialBreakpoint;
  const breakpoints = el.breakpoints;
  const maxBreakpoint = breakpoints && breakpoints[breakpoints.length - 1];
  let isOpen = false;
  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');

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
    animation.progressStart(true, 1 - currentBreakpoint);
  };

  const onMove = (detail: GestureDetail) => {
    const initialStep = 1 - currentBreakpoint;
    offset = clamp(0.0001, initialStep + (detail.deltaY / height), 0.9999);

    animation.progressStep(offset);
    console.log(offset);
  };

  const onEnd = (detail: GestureDetail) => {
    const wrapperKeyframes = wrapperAnimation?.getKeyframes();
    const velocity = detail.velocityY;
    const step = clamp(0.0001, detail.deltaY / height, 0.9999);
    const threshold = (detail.deltaY + velocity * 1000) / height;
    const diff = currentBreakpoint - threshold;

    let closest = 0;
    if (breakpoints) {
      closest = breakpoints.reduce((a, b) => {
        return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
      });
    }

    console.log('current step',offset,'closest breakpoint',closest)

    const shouldRemainOpen = closest !== 0;
    currentBreakpoint = 0;
    isOpen = shouldRemainOpen;

    if (wrapperAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: `translateY(${offset * 100}vh)` },
        { offset: 1, transform: `translateY(${(1 - closest) * 100}vh)`}
      ]);
      animation.progressStep(0);
    }

    //const duration = (shouldRemainOpen) ? computeDuration(step * height, velocity) : computeDuration((1 - step) * height, velocity);


    gesture.enable(false);

    animation
      .onFinish(() => {
        if (shouldRemainOpen) {

          if (wrapperAnimation && wrapperKeyframes) {
            console.log('reset keyframes to', wrapperKeyframes, 'offset', closest);
            wrapperAnimation.keyframes(wrapperKeyframes);
            animation.progressStart(true, 1 - closest);
            currentBreakpoint = closest;
          }

          gesture.enable(true);
        }
      }, { oneTimeCallback: true })
      .progressEnd(1, 0, 300);

    if (!shouldRemainOpen) {
      onDismiss();
    }
  };

  const gesture = createGesture({
    el,
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

const computeDuration = (remaining: number, velocity: number) => {
  return clamp(400, remaining / Math.abs(velocity * 1.1), 500);
};
