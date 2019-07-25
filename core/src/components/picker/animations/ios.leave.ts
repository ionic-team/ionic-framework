import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Picker Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.26, 0.01);

  wrapperAnimation
    .addElement(baseEl.querySelector('.picker-wrapper'))
    .fromTo('transform', 'translateY(0%)', 'translateY(100%)');

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
