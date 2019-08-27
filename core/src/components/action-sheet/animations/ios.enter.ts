import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Action Sheet Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 0.4);

  wrapperAnimation
    .addElement(baseEl.querySelector('.action-sheet-wrapper'))
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
