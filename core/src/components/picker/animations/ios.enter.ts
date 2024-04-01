import { createAnimation } from '@utils/animation/animation';

import type { Animation } from '../../../interface';

/**
 * iOS Picker Enter Animation
 */
export const iosEnterAnimation = (
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
      0.01,
      'var(--backdrop-opacity)'
    )
    .beforeStyles({
      'pointer-events': 'none',
    })
    .afterClearStyles([
      'pointer-events',
    ]);

  wrapperAnimation
    .addElement(
      baseEl.querySelector(
        '.picker-wrapper'
      )!
    )
    .fromTo(
      'transform',
      'translateY(100%)',
      'translateY(0%)'
    );

  return baseAnimation
    .addElement(baseEl)
    .easing(
      'cubic-bezier(.36,.66,.04,1)'
    )
    .duration(400)
    .addAnimation([
      backdropAnimation,
      wrapperAnimation,
    ]);
};
