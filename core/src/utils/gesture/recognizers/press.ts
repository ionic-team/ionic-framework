import { GestureDetail, createGesture } from '../index';

export interface PressRecognizerOptions {
  el: HTMLElement;
  time: number;
  threshold: number;
  onPressHandler?: () => void;
  onPressUpHandler?: () => void;
}

export const createPressRecognizer = (opts: PressRecognizerOptions) => {
  const THRESHOLD = opts.threshold || 10;
  let timeout: any;

  const onStart = () => {
    clearGestureTimeout();

    timeout = setTimeout(() => {
      if (opts.onPressHandler) {
        opts.onPressHandler();
      }

      clearGestureTimeout();
    }, opts.time || 500);
  };

  const onMove = (detail: GestureDetail) => {
    if (Math.abs(detail.deltaX) + Math.abs(detail.deltaY) <= THRESHOLD) {
      return;
    }

    clearGestureTimeout();
  };

  const onEnd = () => {
    if (opts.onPressUpHandler) {
      opts.onPressUpHandler();
    }

    clearGestureTimeout();
  };

  const clearGestureTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return createGesture({
    el: opts.el,
    gestureName: 'press',
    threshold: 0,
    onStart,
    onMove,
    onEnd
  });
};
