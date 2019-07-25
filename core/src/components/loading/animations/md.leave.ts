import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * Md Loading Leave Animation
 */
export const mdLeaveAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.32, 0);

  wrapperAnimation
    .addElement(baseEl.querySelector('.loading-wrapper'))
    .keyframes([
      { offset: 0, opacity: 0.99, transform: 'scale(1)' },
      { offset: 1, opacity: 0, transform: 'scale(0.9)' }
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
