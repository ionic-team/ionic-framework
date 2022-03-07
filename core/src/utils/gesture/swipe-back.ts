import { clamp } from '../helpers';
import { isRTL } from '../rtl';

import { Gesture, GestureDetail, createGesture } from './index';

export const createSwipeBackGesture = (
  el: HTMLElement,
  canStartHandler: () => boolean,
  onStartHandler: () => void,
  onMoveHandler: (step: number) => void,
  onEndHandler: (shouldComplete: boolean, step: number, dur: number) => void,
): Gesture => {
  const win = el.ownerDocument!.defaultView!;
  const rtl = isRTL(el);

  /**
   * Determine if a gesture is near the edge
   * of the screen. If true, then the swipe
   * to go back gesture should proceed.
   */
  const isAtEdge = (detail: GestureDetail) => {
    const threshold = 50;
    const { startX } = detail;

    if (rtl) {
      return startX >= win.innerWidth - threshold;
    }

    return startX <= threshold;
  }

  const getDeltaX = (detail: GestureDetail) => {
    return rtl ? -detail.deltaX : detail.deltaX;
  }

  const getVelocityX = (detail: GestureDetail) => {
    return rtl ? -detail.velocityX : detail.velocityX;
  }

  const canStart = (detail: GestureDetail) => {
    return isAtEdge(detail) && canStartHandler();
  };

  const onMove = (detail: GestureDetail) => {
    // set the transition animation's progress
    const delta = getDeltaX(detail);
    const stepValue = delta / win.innerWidth;
    onMoveHandler(stepValue);
  };

  const onEnd = (detail: GestureDetail) => {
    // the swipe back gesture has ended
    const delta = getDeltaX(detail);
    const width = win.innerWidth;
    const stepValue = delta / width;
    const velocity = getVelocityX(detail);
    const z = width / 2.0;
    const shouldComplete =
      velocity >= 0 && (velocity > 0.2 || delta > z);

    const missing = shouldComplete ? 1 - stepValue : stepValue;
    const missingDistance = missing * width;
    let realDur = 0;
    if (missingDistance > 5) {
      const dur = missingDistance / Math.abs(velocity);
      realDur = Math.min(dur, 540);
    }

    /**
     * TODO: stepValue can sometimes return negative values
     * or values greater than 1 which should not be possible.
     * Need to investigate more to find where the issue is.
     */
    onEndHandler(shouldComplete, (stepValue <= 0) ? 0.01 : clamp(0, stepValue, 0.9999), realDur);
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
