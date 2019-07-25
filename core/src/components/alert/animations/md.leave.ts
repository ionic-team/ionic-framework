import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * Md Alert Leave Animation
 */
export const mdLeaveAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.32, 0);

  wrapperAnimation
    .addElement(baseEl.querySelector('.alert-wrapper'))
    .fromTo('opacity', 0.99, 0);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
