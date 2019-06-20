import { QueueApi } from '@stencil/core';

import { Gesture, GestureDetail, createGesture } from '../../utils/gesture';

export function createCollapseGesture(
  el: HTMLElement,
  queue: QueueApi,
  canStartHandler: (detail: GestureDetail) => boolean,
  onStartHandler: () => void,
  onMoveHandler: (detail: GestureDetail) => void,
  onEndHandler: (detail: GestureDetail) => void,
): Gesture {
  function canStart(detail: GestureDetail) {
    return canStartHandler(detail);
  }

  function onMove(detail: GestureDetail) {
    onMoveHandler(detail);
  }

  function onEnd(detail: GestureDetail) {
    onEndHandler(detail);
  }

  return createGesture({
    el,
    queue,
    gestureName: 'collapse-swipe',
    gesturePriority: 40,
    threshold: 0,
    canStart,
    onStart: onStartHandler,
    onMove,
    onEnd
  });
}
