import { createAnimation } from '@utils/animation/animation';

import type { Animation } from '../../../interface';

/**
 * MD Action Sheet Leave Animation
 */
export const mdLeaveAnimation = (
  baseEl: HTMLElement
): Animation => {
  const baseAnimation =
    createAnimation();
  const backdropAnimation =
    createAnimation();
  const wrapperAnimation =
    createAnimation();

  backdropAnimation
    .addElement(
      baseEl.querySelector(
        'ion-backdrop'
      )!
    )
    .fromTo(
      'opacity',
      'var(--backdrop-opacity)',
      0
    );

  wrapperAnimation
    .addElement(
      baseEl.querySelector(
        '.action-sheet-wrapper'
      )!
    )
    .fromTo(
      'transform',
      'translateY(0%)',
      'translateY(100%)'
    );

  return baseAnimation
    .addElement(baseEl)
    .easing(
      'cubic-bezier(.36,.66,.04,1)'
    )
    .duration(450)
    .addAnimation([
      backdropAnimation,
      wrapperAnimation,
    ]);
};
