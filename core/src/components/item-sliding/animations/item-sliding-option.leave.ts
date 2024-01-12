import { createAnimation } from "@utils/animation/animation";

import type { Animation } from '../../../interface';

interface ItemSlidingOptionLeaveAnimationOptions {
  /**
   * Whether the item is right-to-left.
   */
  isRTL: boolean;
  /**
   * Whether the item should transform to its reset state.
   * This can be the collapsed state if the item is sliding close,
   * or the opened state if the item is sliding open.
   */
  isReset: boolean;
  /**
   * The total width of previous sliding items behind the option.
   */
  optionWidthOffset: number;
  containerWidthOffset: number;
}

/**
 * Animation for the sliding items at the end (right) of the item.
 */
export const slidingItemEndLeaveAnimation = (baseEl: HTMLIonItemOptionElement, {
  isRTL,
  isReset,
  optionWidthOffset,
  containerWidthOffset
}: ItemSlidingOptionLeaveAnimationOptions): Animation => {

  const finalTransform = isRTL
    ? `translate3d(${optionWidthOffset + baseEl.clientWidth}px,0,0)`
    : `translate3d(${containerWidthOffset - optionWidthOffset}px,0,0)`;

  const animation = createAnimation();

  return animation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(300)
    .fromTo('transform', baseEl.style.transform, isReset ? finalTransform : `translate3d(0,0,0)`)
    .afterClearStyles(['transform', 'z-index']);
}

/**
 * Animation for the sliding items at the start (left) of the item.
 */
export const slidingItemStartLeaveAnimation = (baseEl: HTMLIonItemOptionElement, {
  isRTL,
  isReset,
  optionWidthOffset,
  containerWidthOffset
}: ItemSlidingOptionLeaveAnimationOptions): Animation => {
  const finalTransform = isRTL
    ? `translate3d(-${containerWidthOffset - optionWidthOffset}px, 0, 0)`
    : `translate3d(-${baseEl.clientWidth + optionWidthOffset}px, 0, 0)`;

  const animation = createAnimation();

  return animation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(300)
    .fromTo('transform', baseEl.style.transform, isReset ? finalTransform : `translate3d(0,0,0)`)
    .afterClearStyles(['transform', 'z-index']);
}
