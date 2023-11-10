import type { GestureConfig, GestureDetail } from './index';
import { createGesture } from './index';

export interface PressRecognizerOptions extends GestureConfig {
  /**
   * How long the user must press the
   * element before onPressHandler is fired.
   */
  time: number;

  /**
   * The maximum amount of movement on the x and y
   * axes that is allowed and still have onPressHandler fire.
   */
  maxThreshold: number;

  /**
   * Fired when the long press occurs.
   */
  onPressHandler?: (detail: any) => void;

  /**
   * Fired when the pointer is lifted.
   */
  onPressUpHandler?: () => void;
}

export const createPressRecognizer = (opts: PressRecognizerOptions) => {
  const THRESHOLD = opts.maxThreshold || 10;
  let timeout: any;
  let pressed = false;

  const onStart = (detail: GestureDetail) => {
    if (opts.onStart) {
      opts.onStart(detail);
    }

    clearGestureTimeout();

    timeout = setTimeout(() => {
      if (opts.onPressHandler) {
        opts.onPressHandler(detail);
      }

      pressed = true;
      clearGestureTimeout();
    }, opts.time || 500);
  };

  const onMove = (detail: GestureDetail) => {
    if (!pressed) {
      return;
    }

    // Moving should only happen after the press
    if (opts.onMove) {
      opts.onMove(detail);
    }

    if (Math.abs(detail.deltaX) + Math.abs(detail.deltaY) <= THRESHOLD) {
      return;
    }

    clearGestureTimeout();
  };

  const onEnd = (detail: GestureDetail) => {
    if (opts.onEnd) {
      opts.onEnd(detail);
    }

    if (!pressed) {
      return;
    }

    if (opts.onPressUpHandler) {
      opts.onPressUpHandler();
    }

    pressed = false;
    clearGestureTimeout();
  };

  const clearGestureTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return createGesture({
    ...opts,
    gestureName: opts.gestureName || 'press',
    threshold: opts.threshold ?? 0,
    onStart,
    onMove,
    onEnd,
  });
};
