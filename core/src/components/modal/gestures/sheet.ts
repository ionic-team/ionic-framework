import { Animation } from '../../../interface';
import { GestureDetail, createGesture } from '../../../utils/gesture';
import { clamp, raf } from '../../../utils/helpers';

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
  onDismiss: () => void,
  onBreakpointChange: (breakpoint: number) => void
) => {
  const contentEl = el.querySelector('ion-content');
  const height = window.innerHeight;
  let currentBreakpoint = el.initialBreakpoint!;
  const wrapperAnimation = animation.childAnimations.find(ani => ani.id === 'wrapperAnimation');
  const backdropAnimation = animation.childAnimations.find(ani => ani.id === 'backdropAnimation');
  const isAtMaxBreakpoint = () => currentBreakpoint === breakpoints[breakpoints.length - 1];

  if (wrapperAnimation && backdropAnimation) {
    wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
    backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
    animation.progressStart(true, 1 - currentBreakpoint);
  }

  const canStart = (detail: GestureDetail) => {
    const content = (detail.event.target! as HTMLElement).closest('ion-content');

    if (isAtMaxBreakpoint() && content) {
      return false;
    }

    return true;
  };

  const onStart = () => {
    if (contentEl) {
      contentEl.scrollY = false;
    }

    animation.progressStart(true, 1 - currentBreakpoint);
  };

  const onMove = (detail: GestureDetail) => {
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

      animation.progressStep(0)
    }

    gesture.enable(false);

    animation
      .onFinish(() => {
        if (shouldRemainOpen) {
          if (wrapperAnimation && backdropAnimation) {
            raf(() => {
              wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
              backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
              animation.progressStart(true, 1 - closest);
              currentBreakpoint = closest;
              onBreakpointChange(currentBreakpoint);

              if (contentEl && currentBreakpoint === breakpoints[breakpoints.length - 1]) {
                contentEl.scrollY = true;
              }

              gesture.enable(true);
            });
          } else {
            gesture.enable(true);
          }
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
