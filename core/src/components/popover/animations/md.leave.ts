import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * Md Popover Leave Animation
 */
export const mdLeaveAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.32, 0);

  wrapperAnimation
    .addElement(baseEl.querySelector('.popover-wrapper'))
    .fromTo('opacity', 0.99, 0);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(500)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
