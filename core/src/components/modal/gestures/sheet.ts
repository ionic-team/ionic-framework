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
  const contentEl = el.querySelector('ion-content');
  const height = window.innerHeight;
  let currentBreakpoint = el.initialBreakpoint;
  const breakpoints = el.breakpoints;
  const maxBreakpoint = breakpoints && breakpoints[breakpoints.length - 1];
  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');

  const canStart = () => true;

  const onStart = () => {
    // When the gesture starts we need to turn off the content scrolling
    // because the content shouldn't scroll unless it's fullscreen
    if (contentEl) {
      contentEl.scrollY = false;
    }

    animation.progressStart(true, 1 - currentBreakpoint);
  };

  const onMove = (detail: GestureDetail) => {
    const target = detail.event.target as HTMLElement | null;

    const content = target!.closest('ion-content');

    if (content === null) {
      // If we're not dragging inside of the content we need to allow
      // the modal to drag higher than the maximum breakpoint
      console.log('we are dragging above content, go beyond max breakpoint');
    } else {
      // Target is in the content, we need to allow the modal to increase height
      // until the maximum breakpoint is reached and then allow scrolling the content
      console.log('we need to stop at maxBreakpoint', maxBreakpoint);
      content.scrollY = false;

      console.log('current breakpoint vs max', currentBreakpoint, maxBreakpoint);
      if (currentBreakpoint === maxBreakpoint) {
        content.scrollY = true;
      }
    }

    const initialStep = 1 - currentBreakpoint;
    offset = clamp(0.0001, initialStep + (detail.deltaY / height), 0.9999);

    console.log('offset', offset);

    animation.progressStep(offset);
  };

  const onEnd = (detail: GestureDetail) => {
    const wrapperKeyframes = wrapperAnimation?.getKeyframes();
    const velocity = detail.velocityY;
    // const step = clamp(0.0001, detail.deltaY / height, 0.9999);
    const threshold = (detail.deltaY + velocity * 1000) / height;
    const diff = currentBreakpoint - threshold;

    let closest = 0;
    if (breakpoints) {
      closest = breakpoints.reduce((a, b) => {
        return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
      });
    }

    const shouldRemainOpen = closest !== 0;
    currentBreakpoint = 0;

    if (wrapperAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: `translateY(${offset * 100}vh)` },
        { offset: 1, transform: `translateY(${(1 - closest) * 100}vh)` }
      ]);
      animation.progressStep(0);
    }

    // const duration = (shouldRemainOpen) ? computeDuration(step * height, velocity) : computeDuration((1 - step) * height, velocity);

    gesture.enable(false);

    animation
      .onFinish(() => {
        if (shouldRemainOpen) {

          if (wrapperAnimation && wrapperKeyframes) {
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

// const computeDuration = (remaining: number, velocity: number) => {
//   return clamp(400, remaining / Math.abs(velocity * 1.1), 500);
// };
