import { Animation } from '../../../interface';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp } from '../../../utils/helpers';

// Defaults for the sheet swipe animation
const SheetDefaults = {
  WRAPPER_KEYFRAMES: [
    { offset: 0, transform: 'translateY(0vh)' },
    { offset: 1, transform: 'translateY(100vh)' }
  ],
  BACKDROP_KEYFRAMES: [
    { offset: 0, opacity: 'var(--backdrop-opacity)' },
    { offset: 1, opacity: 0.01 }
  ]
};

// TODO
let offset = 0;

export const createSheetGesture = (
  el: HTMLIonModalElement,
  animation: Animation,
  breakpoints: number[] = [],
  onDismiss: () => void
) => {
  const contentEl = el.querySelector('ion-content');
  const height = window.innerHeight;
  let currentBreakpoint = el.initialBreakpoint;
  // const maxBreakpoint = breakpoints && breakpoints[breakpoints.length - 1];
  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');
  const backdropAnimation = animation.childAnimations.find(ani => ani.id === 'backdropAnimation');

  if (wrapperAnimation && backdropAnimation) {
    wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
    backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
    animation.progressStart(true, 1 - currentBreakpoint);
  }

  const canStart = () => true;

  const onStart = () => {
    // When the gesture starts we need to turn off the content scrolling
    // because the content shouldn't scroll unless it's fullscreen
    // TODO this does not work properly because sometimes you can scroll the content quickly
    if (contentEl) {
      contentEl.scrollY = false;
    }

    animation.progressStart(true, 1 - currentBreakpoint);
  };

  const onMove = (detail: GestureDetail) => {
    const target = detail.event.target as HTMLElement | null;

    // If we're not dragging inside of the content we need to allow
    // the modal to drag higher than the maximum breakpoint
    const content = target!.closest('ion-content');
    if (content !== null) {
      // Target is in the content, we need to allow the modal to increase height
      // until the maximum breakpoint is reached and then allow scrolling the content
      content.scrollY = false;

      /*
      if (wrapperAnimation && maxBreakpoint) {
        wrapperAnimation.keyframes([
          { offset: 0, transform: `translateY(${(1 - maxBreakpoint) * 100}vh)` },
          { offset: 1, transform: `translateY(100vh)` }
        ]);
      }
      */

      if (offset === 0.0001) {
        content.scrollY = true;
      }
    }

    const initialStep = 1 - currentBreakpoint;
    offset = clamp(0.0001, initialStep + (detail.deltaY / height), 0.9999);
    animation.progressStep(offset);
  };

  const onEnd = (detail: GestureDetail) => {
    const velocity = detail.velocityY;
    const threshold = (detail.deltaY + velocity * 1000) / height;
    const diff = currentBreakpoint - threshold;

    const closest = breakpoints.reduce((a, b) => {
      return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
    });

    const shouldRemainOpen = closest !== 0;
    currentBreakpoint = 0;

    if (wrapperAnimation && backdropAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: `translateY(${offset * 100}vh)` },
        { offset: 1, transform: `translateY(${(1 - closest) * 100}vh)` }
      ]);

      backdropAnimation.keyframes([
        { offset: 0, opacity: `calc(var(--backdrop-opacity) * ${1 - offset})` },
        { offset: 1, opacity: `calc(var(--backdrop-opacity) * ${closest})` }
      ]);
    }

    // const duration = (shouldRemainOpen) ? computeDuration(step * height, velocity) : computeDuration((1 - step) * height, velocity);

    gesture.enable(false);

    animation
      .onFinish(() => {
        animation.progressStart(true, 1);
        if (shouldRemainOpen) {
          if (wrapperAnimation && backdropAnimation) {
            wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
            backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
            animation.progressStep(1 - closest);
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
