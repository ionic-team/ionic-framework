import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';

/**
 * Md Modal Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): IonicAnimation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const backdropVar = getComputedStyle(baseEl).getPropertyValue('--ion-backdrop-opacity');
  const backdropOpacity = backdropVar ? backdropVar : 0.32;

  backdropAnimation
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, backdropOpacity);

  wrapperAnimation
    .addElement(baseEl.querySelector('.modal-wrapper'))
    .keyframes([
      { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
      { offset: 1, opacity: 1, transform: 'translateY(0px)' }
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(280)
    .beforeAddClass('show-modal')
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
