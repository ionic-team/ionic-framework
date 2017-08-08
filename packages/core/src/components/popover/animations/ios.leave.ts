import { Animation } from '../../../index';

/**
 * iOS Modal Leave Animation
 */
export default function(Animation: Animation, baseElm: HTMLElement) {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.popover-backdrop'));

  const wrapperAnimation = new Animation();
  const wrapperElm = baseElm.querySelector('.popover-wrapper');

  wrapperAnimation.fromTo('opacity', 0.99, 0);
  backdropAnimation.fromTo('opacity', 0.08, 0);


  return baseAnimation
    .addElement(baseElm)
    .easing('ease')
    .duration(500)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
