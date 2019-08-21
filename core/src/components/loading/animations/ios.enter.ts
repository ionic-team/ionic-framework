import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Loading Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 0.3);

  wrapperAnimation
    .addElement(baseEl.querySelector('.loading-wrapper'))
    .keyframes([
      { offset: 0, opacity: 0.01, transform: 'scale(1.1)' },
      { offset: 1, opacity: 1, transform: 'scale(1)' }
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
