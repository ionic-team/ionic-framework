import { GESTURE } from '@utils/overlays';

import type { Animation } from '../../../interface';

export const handleCanDismiss = async (
  el: HTMLIonModalElement,
  animation: Animation
) => {
  /**
   * If canDismiss is not a function
   * then we can return early. If canDismiss is `true`,
   * then canDismissBlocksGesture is `false` as canDismiss
   * will never interrupt the gesture. As a result,
   * this code block is never reached. If canDismiss is `false`,
   * then we never dismiss.
   */
  if (
    typeof el.canDismiss !== 'function'
  ) {
    return;
  }

  /**
   * Run the canDismiss callback.
   * If the function returns `true`,
   * then we can proceed with dismiss.
   */
  const shouldDismiss =
    await el.canDismiss(
      undefined,
      GESTURE
    );
  if (!shouldDismiss) {
    return;
  }

  /**
   * If canDismiss resolved after the snap
   * back animation finished, we can
   * dismiss immediately.
   *
   * If canDismiss resolved before the snap
   * back animation finished, we need to
   * wait until the snap back animation is
   * done before dismissing.
   */

  if (animation.isRunning()) {
    animation.onFinish(
      () => {
        el.dismiss(
          undefined,
          'handler'
        );
      },
      { oneTimeCallback: true }
    );
  } else {
    el.dismiss(undefined, 'handler');
  }
};

/**
 * This function lets us simulate a realistic spring-like animation
 * when swiping down on the modal.
 * There are two forces that we need to use to compute the spring physics:
 *
 * 1. Stiffness, k: This is a measure of resistance applied a spring.
 * 2. Dampening, c: This value has the effect of reducing or preventing oscillation.
 *
 * Using these two values, we can calculate the Spring Force and the Dampening Force
 * to compute the total force applied to a spring.
 *
 * Spring Force: This force pulls a spring back into its equilibrium position.
 * Hooke's Law tells us that that spring force (FS) = kX.
 * k is the stiffness of a spring, and X is the displacement of the spring from its
 * equilibrium position. In this case, it is the amount by which the free end
 * of a spring was displaced (stretched/pushed) from its "relaxed" position.
 *
 * Dampening Force: This force slows down motion. Without it, a spring would oscillate forever.
 * The dampening force, FD, can be found via this formula: FD = -cv
 * where c the dampening value and v is velocity.
 *
 * Therefore, the resulting force that is exerted on the block is:
 * F = FS + FD = -kX - cv
 *
 * Newton's 2nd Law tells us that F = ma:
 * ma = -kX - cv.
 *
 * For Ionic's purposes, we can assume that m = 1:
 * a = -kX - cv
 *
 * Imagine a block attached to the end of a spring. At equilibrium
 * the block is at position x = 1.
 * Pressing on the block moves it to position x = 0;
 * So, to calculate the displacement, we need to take the
 * current position and subtract the previous position from it.
 * X = x - x0 = 0 - 1 = -1.
 *
 * For Ionic's purposes, we are only pushing on the spring modal
 * so we have a max position of 1.
 * As a result, we can expand displacement to this formula:
 * X = x - 1
 *
 * a = -k(x - 1) - cv
 *
 * We can represent the motion of something as a function of time: f(t) = x.
 * The derivative of position gives us the velocity: f'(t)
 * The derivative of the velocity gives us the acceleration: f''(t)
 *
 * We can substitute the formula above with these values:
 *
 * f"(t) = -k * (f(t) - 1) - c * f'(t)
 *
 * This is called a differential equation.
 *
 * We know that at t = 0, we are at x = 0 because the modal does not move: f(0) = 0
 * This means our velocity is also zero: f'(0) = 0.
 *
 * We can cheat a bit and plug the formula into Wolfram Alpha.
 * However, we need to pick stiffness and dampening values:
 * k = 0.57
 * c = 15
 *
 * I picked these as they are fairly close to native iOS's spring effect
 * with the modal.
 *
 * What we plug in is this: f(0) = 0; f'(0) = 0; f''(t) = -0.57(f(t) - 1) - 15f'(t)
 *
 * The result is a formula that lets us calculate the acceleration
 * for a given time t.
 * Note: This is the approximate form of the solution. Wolfram Alpha will
 * give you a complex differential equation too.
 */
export const calculateSpringStep = (
  t: number
) => {
  return (
    0.00255275 *
      2.71828 ** (-14.9619 * t) -
    1.00255 *
      2.71828 ** (-0.0380968 * t) +
    1
  );
};
