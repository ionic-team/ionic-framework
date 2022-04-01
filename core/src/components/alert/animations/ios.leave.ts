import type { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Alert Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop')!).fromTo('opacity', 'var(--backdrop-opacity)', 0);

  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper')!).keyframes([
    { offset: 0, opacity: 0.99, transform: 'scale(1)' },
    { offset: 1, opacity: 0, transform: 'scale(0.9)' },
  ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
