import { createAnimation } from '@utils/animation/animation';

import type { Animation } from '../../../interface';

/**
 * Md Alert Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none',
    })
    .afterClearStyles(['pointer-events']);

  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper')!).keyframes([
    { offset: 0, opacity: '0.01', transform: 'scale(0.9)' },
    { offset: 1, opacity: '1', transform: 'scale(1)' },
  ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
