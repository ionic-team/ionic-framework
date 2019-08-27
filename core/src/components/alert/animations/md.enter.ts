import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * Md Alert Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 0.32);

  wrapperAnimation
    .addElement(baseEl.querySelector('.alert-wrapper'))
    .keyframes([
      { offset: 0, opacity: 0.01, transform: 'scale(0.9)' },
      { offset: 1, opacity: 1, transform: 'scale(1)' }
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
