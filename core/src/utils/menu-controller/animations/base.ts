import { createAnimation } from '../../animation/animation';
import type { Animation } from '../../animation/animation-interface';

/**
 * baseAnimation
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */

export const baseAnimation = (
  isIos: boolean
): Animation => {
  // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
  // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves

  /**
   * "Apply the sharp curve to items temporarily leaving the screen that may return
   * from the same exit point. When they return, use the deceleration curve. On mobile,
   * this transition typically occurs over 300ms" -- MD Motion Guide
   */

  return createAnimation().duration(
    isIos ? 400 : 300
  );
};
