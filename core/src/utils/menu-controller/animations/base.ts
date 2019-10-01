import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../animation/animation';

/**
 * baseAnimation
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export const baseAnimation = (AnimationC: Animation, isIos: boolean): Promise<Animation> => {
  // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
  // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves

  // "Apply the sharp curve to items temporarily leaving the screen that may return
  // from the same exit point. When they return, use the deceleration curve. On mobile,
  // this transition typically occurs over 300ms" -- MD Motion Guide

  const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
  const easing = isIos ? iosEasing : 'cubic-bezier(0.0,0.0,0.2,1)';
  const easingReverse = isIos ? iosEasing : 'cubic-bezier(0.4,0.0,0.6,1)';
  const dur = isIos ? 400 : 300;

  return Promise.resolve(
    new AnimationC()
      .easing(easing) // Deceleration curve (Entering the screen)
      .easingReverse(easingReverse) // Sharp curve (Temporarily leaving the screen)
      .duration(dur));
};
