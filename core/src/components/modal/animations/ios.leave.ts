import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * iOS Modal Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  const backdropVar = getComputedStyle(baseEl).getPropertyValue('--ion-backdrop-opacity');
  const backdropOpacity = backdropVar !== '' ? backdropVar : 0.4;

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', backdropOpacity, 0.0);

  wrapperAnimation
    .addElement(wrapperEl)
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', 'translateY(0%)', `translateY(${(baseEl.ownerDocument as any).defaultView.innerHeight - wrapperElRect.top}px)`);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(250)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
