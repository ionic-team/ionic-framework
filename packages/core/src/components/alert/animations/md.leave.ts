import { Animation } from '../../../index';

/**
 * Md Alert Leave Animation
 */
export default function mdLeaveAnimation(Animation: Animation, baseElm: HTMLElement): Animation {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.alert-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.alert-wrapper'));

  backdropAnimation.fromTo('opacity', 0.5, 0);

  wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);

  return baseAnimation
    .addElement(baseElm)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);
}
