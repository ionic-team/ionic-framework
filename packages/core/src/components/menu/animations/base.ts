import { Animation } from '../../../index';

/**
 * baseAnimation
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export default function baseAnimation(Animation: Animation): Animation {
  // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
  // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves

  /** TODO replace duration(280ms)
   * - Mobile entering time: 225ms
   * - Mobile leaving time: 195ms
   *
   * - Tablet time = Mobile time * 1.3 (+30%)
   * - Tablet entering time: 292.5
   * - Tablet leaving time: 253.5
   */
  return new Animation()
    .easing('cubic-bezier(0.0, 0.0, 0.2, 1)') // Deceleration curve (Entering the screen)
    .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)') // Sharp curve (Temporarily leaving the screen)
    .duration(280);
}
