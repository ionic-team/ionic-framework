
import { Gesture, GestureDetail, createGesture } from './index';

export const createSwipeBackGesture = (
  el: HTMLElement,
  canStartHandler: () => boolean,
  onStartHandler: () => void,
  onMoveHandler: (step: number) => void,
  onEndHandler: (shouldComplete: boolean, step: number, dur: number) => void,
): Gesture => {
  const win = el.ownerDocument!.defaultView!;
  const canStart = (detail: GestureDetail) => {
    return detail.startX <= 50 && canStartHandler();
  };

  const onMove = (detail: GestureDetail) => {
    // set the transition animation's progress
    const delta = detail.deltaX;
    const stepValue = delta / win.innerWidth;
    onMoveHandler(stepValue);
  };

  const onEnd = (detail: GestureDetail) => {
    // the swipe back gesture has ended
    const delta = detail.deltaX;
    const width = win.innerWidth;
    const stepValue = delta / width;
    const velocity = detail.velocityX;
    const z = width / 2.0;
    const shouldComplete =
      velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);

    const missing = shouldComplete ? 1 - stepValue : stepValue;
    const missingDistance = missing * width;
    let realDur = 0;
    if (missingDistance > 5) {
      const dur = missingDistance / Math.abs(velocity);
      realDur = Math.min(dur, 300);
    }
    onEndHandler(shouldComplete, stepValue, realDur);
  };

  return createGesture({
    el,
    gestureName: 'goback-swipe',
    gesturePriority: 40,
    threshold: 10,
    canStart,
    onStart: onStartHandler,
    onMove,
    onEnd
  });
};
