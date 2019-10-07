import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Popover Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const backdropVar = getComputedStyle(baseEl).getPropertyValue('--ion-backdrop-opacity');
  const backdropOpacity = backdropVar !== '' ? backdropVar : 0.08;

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', backdropOpacity, 0);

  wrapperAnimation
    .addElement(baseEl.querySelector('.popover-wrapper'))
    .fromTo('opacity', 0.99, 0);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease')
    .duration(500)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
