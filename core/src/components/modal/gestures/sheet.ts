import { Animation } from '../../../interface';
import { getTimeGivenProgression } from '../../../utils/animation/cubic-bezier';
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
  onDismiss: () => void,
  getInitialStep: () => number,
) => {
  const height = window.innerHeight;
  let currentBreakpoint = el.initialBreakpoint;
  const breakpoints = el.breakpoints;
  const maxBreakpoint = breakpoints && breakpoints[breakpoints.length - 1];
  let isOpen = false;

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
    const initialStep = currentBreakpoint ? 1 - currentBreakpoint : getInitialStep();
    console.log('starting at currentBreakpoint', currentBreakpoint);
    console.log('starting at initialStep', initialStep);

    animation.progressStart(true, initialStep);
  };

  const onMove = (detail: GestureDetail) => {
    const initialStep = currentBreakpoint ? 1 - currentBreakpoint : getInitialStep();
    offset = initialStep + (detail.deltaY / height);

    const step = clamp(0.0001, offset, 0.9999);
    animation.progressStep(step);
    // offset = base + Math.min(1, detail.deltaY / 100);

    // animation.progressStep(offset);
    // console.log('offset', offset);

    // const step = clamp(0.0001, detail.deltaY / height, 0.9999);
    // animation.progressStep(step);
    // console.log(step);

    // console.log('got breakpoints', breakpoints);
    // console.log('height', height);
    // console.log('maxBreakpoint', maxBreakpoint);
  };

  const onEnd = (detail: GestureDetail) => {
    const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');
    const wrapperKeyframes = wrapperAnimation?.getKeyframes();
    console.log('wrapper', wrapperKeyframes, wrapperAnimation);

    const velocity = detail.velocityY;

    const step = clamp(0.0001, detail.deltaY / height, 0.9999);

    const threshold = (detail.deltaY + velocity * 1000) / height;

    const diff = currentBreakpoint - threshold;
    // console.log('threshold', threshold);
    // console.log('diff', diff);

    let closest = 0;
    if (breakpoints) {
      closest = breakpoints.reduce((a, b) => {
        return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
      });

      console.log('closest', closest);
    }

    console.log('currentBreakpoint', currentBreakpoint);

    const shouldComplete = closest === 0;
    // let newStepValue = (shouldComplete) ? -0.001 : closest;
    const newStepValue = .5;
    currentBreakpoint = newStepValue;

    // TODO 0 offset needs to be current location
    // 1 offset needs to be snap to
    if (wrapperAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: 'translateY(55vh)' },
        { offset: 1, transform: 'translateY(50vh)' }
      ]);
    }

    if (!shouldComplete) {
      animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
      // newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], step)[0];
      console.log('newStepValue', newStepValue);
    } else {
      animation.easing('cubic-bezier(0.32, 0.72, 0, 1)');
      // newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], step)[0];
      console.log('newStepValue', newStepValue);
    }

    const duration = (shouldComplete) ? computeDuration(step * height, velocity) : computeDuration((1 - step) * height, velocity);
    isOpen = shouldComplete;

    gesture.enable(false);

    animation
      .onFinish(() => {
        if (!shouldComplete) {
          gesture.enable(true);

          if (wrapperAnimation && wrapperKeyframes) {
            wrapperAnimation.keyframes(wrapperKeyframes);
            wrapperAnimation.progressStep(newStepValue);
          }
        }
      })
      .progressEnd((shouldComplete) ? 1 : 0, newStepValue, duration);

    if (shouldComplete) {
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
